# Auditoría técnica de Cofira

> Auditoría multiagente (repo · seguridad · backend · frontend · tests/CI) sobre el código real.
> Fecha: 2026-06. Solo análisis, sin cambios aplicados.

## Resumen ejecutivo

Cofira es un proyecto sólido y ambicioso (Spring Boot 4 + Angular 20, IA, pagos, accesibilidad).
La arquitectura base es buena, pero hay **fallos críticos de seguridad y de higiene de repo** que
hay que arreglar antes de enseñarlo como portfolio, y **0% de tests reales**.

| Área | Estado | Lo más grave |
|------|--------|--------------|
| Repo / estructura | 🔴 | 23.000+ archivos basura trackeados (node_modules, build) |
| Seguridad | 🔴 | Secretos en git, escalada de privilegios, IDOR (robo de cuentas), pago saltable |
| Calidad backend | 🟠 | Bug de aislamiento de datos entre usuarios, capas mezcladas, datos inventados por IA |
| Calidad frontend | 🟠 | Rutas debug públicas, password en console.log, sin lazy-load, sin interceptor |
| Tests / CI-CD | 🔴 | 0% cobertura real; CI despliega a producción sin ejecutar un solo test |

Nota positiva: las contraseñas **sí** se cifran con BCrypt (el aviso previo de texto plano era
sobre la copia descompilada; en el código real está bien). Las API keys de IA están server-side.
Las queries JPA usan binding (sin SQL injection). Dockerfiles y docker-compose están bien hechos.

---

## 🔴 CRÍTICO (arreglar primero)

### SEC-1 · Secretos commiteados a git
- JWT secret en `backend/src/main/resources/application.properties:18` (sin `${...}`, valor literal).
- `spring.datasource.password=admin123` (properties) y en `docker-compose.yml`/`-dev.yml` + pgAdmin.
- **Impacto:** con el JWT secret cualquiera **forja tokens de cualquier usuario/rol** → compromiso total.
- **Fix:** rotar secret y passwords; externalizar a env sin fallback (`${JWT_SECRET}`); purgar del
  historial (`git filter-repo`); dejar de trackear `backend/bin/`.

### REPO-1 · node_modules + artefactos en control de versiones
- ~22.828 archivos de `node_modules` + 649 de `build/`/`bin/` + 264 `.class` + 13 `.DS_Store`.
  ~96% del repo es basura. El `.gitignore` ya los cubre, pero se subieron antes.
- **Fix:** `git rm -r --cached cofira/node_modules backend/build backend/bin cofira/.angular .idea backend/.idea && git rm --cached $(git ls-files '*.DS_Store')` → commit.

### SEC-2 · Escalada de privilegios en el registro
- `services/AuthService.java` + `dto/auth/RegisterRequestDTO.java` — el registro público acepta el
  campo `rol` del cliente → cualquiera se registra como `ADMIN`/`ORGANIZADOR`.
- **Fix:** quitar `rol` del DTO, forzar rol básico en servidor; promoción de admin en endpoint aparte
  con `@PreAuthorize("hasRole('ADMIN')")`.

### SEC-3 · Control de acceso roto / IDOR (robo de cuentas)
- `UsuarioController` (y `Plan`, `Objetivos`, `RutinaAlimentacion`, `RutinaEjercicio`) sin
  `@PreAuthorize` ni comprobación de propietario.
- `PUT /api/usuarios/{id}` permite a cualquier usuario **cambiar la contraseña de otro** → takeover.
  `/email` y `/username` son `permitAll` → enumeración de usuarios sin login.
- **Fix:** `@PreAuthorize("hasRole('ADMIN')")` en operaciones de admin; en self-service derivar el
  usuario del `Principal` (como ya hacen bien `OnboardingController`/`mi-rutina`/`mi-menu`).

### SEC-4 · Mass-assignment de rol en CRUD de usuarios
- `dto/usuario/CrearUsuarioDTO.java` expone `rol`; `UsuarioService.crearUsuario` lo aplica sin filtrar.
- **Fix:** quitar `rol` del DTO; cambios de rol solo por ruta protegida de admin.

### FE-1 · El pago de Cofira PRO es saltable desde el navegador
- `services/suscripcion.service.ts` — `activarSuscripcionPro()` no llama al backend: crea la
  suscripción en local y la guarda en `localStorage`; `proGuard` lee de ahí. DevTools → PRO gratis.
- **Fix:** el pago debe confirmarse en el backend y el guard leer de un claim firmado (JWT) o endpoint.

### CI-1 · CI despliega a producción sin ejecutar tests
- `.github/workflows/deploy.yml` solo hace SSH → `git pull` → `docker compose up --build` en push a
  `main`. Sin tests, sin build-check, sin trigger de PR, sin rollback.
- **Fix:** workflow `ci.yml` en `pull_request` que ejecute `./gradlew test` + `ng build` + `ng test`;
  `deploy.yml` con `needs: ci`.

---

## 🟠 ALTO

### Seguridad
- **SEC-5** Actuator `env` expuesto y `permitAll` en `/actuator/**` → fuga de config/secretos.
- **SEC-6** `AuthTokenFilter` no falla cerrado en token revocado (logout) y traga excepciones.
- **SEC-7** JWT sin issuer/audience, TTL 24h, sin refresh token.
- **SEC-8** CORS con origen HTTP (IP plana) y `allowCredentials=true`; sin cabeceras de seguridad/CSP/HSTS; `frameOptions.disable()` + config muerta de H2.

### Backend
- **BE-1** Bug de aislamiento: `scheduled/ScheduledTasks` coge el feedback **global** (no por usuario)
  → el feedback de un usuario afecta a las rutinas de otros. `FeedbackEjercicio` necesita FK a usuario.
- **BE-2** `OnboardingController` y `ConsumoComidaController` saltan la capa de servicio (tocan repo / llaman IA directos).
- **BE-3** `GeminiService` se construye con `new` (RestTemplate/ObjectMapper propios) → no inyectable, no testeable, `@Value` puede quedar null.
- **BE-4** Ante fallo de parseo, `GeminiService` **inventa datos nutricionales** (300 kcal...) y los guarda en BBDD.
- **BE-5** 5 entidades de comida casi idénticas (`Desayuno`/`Almuerzo`/...) + cadena `instanceof`. Unificar en una entidad con `tipo`.
- **BE-6** `RutinaAlimentacion`/`RutinaEjercicio` guardan los datos **dos veces** (entidades + blob JSON) → se desincronizan.
- **BE-7** `orphanRemoval` ausente en `Usuario.rutinaEjercicio` → la tarea programada deja huérfanos y engorda la BBDD.
- **BE-8** `generarMenuSemanal` hace 14 llamadas HTTP secuenciales (hasta 28 min en un hilo). Usar la versión streaming.
- **BE-9** `GlobalExceptionHandler` usa `printStackTrace()` y filtra `debug` al cliente.

### Frontend
- **FE-2** Rutas `/pruebas` y `/style-guide` accesibles en producción sin guard.
- **FE-3** 63 `console.*` en producción; `form-register.ts` loguea el **password** en claro.
- **FE-4** Sin `HttpInterceptor`: el token se inyecta a mano en cada servicio (string mágico `"cofira_token"` x3).
- **FE-5** Sin lazy-loading: las ~20 páginas van todas en el bundle inicial.
- **FE-6** `setTimeout` en bucle para esperar estado async (hay signals para eso).
- **FE-7** `.bind(this)` dentro de `computed()`/`tap()` en `suscripcion.service.ts` (anti-patrón).
- **FE-8** `Button.habilitado` con lógica invertida (`false` = habilitado).
- **FE-9** `_dark-mode.scss`: 2.715 líneas acopladas a clases internas de componentes + `ViewEncapsulation.None` en Header. Migrar a custom properties por componente.

### Tests
- **TEST-1** Backend: solo `contextLoads()`. 0 tests de servicios/controllers (incl. `JwtUtils`, `AuthService`, `CalorieCalculationService`).
- **TEST-2** Frontend: 19 `.spec.ts` pero todos son scaffolds (`toBeTruthy()`); `app.spec.ts` aún busca "Hello, cofira" → falla. Sin e2e.
- **TEST-3** Sin ESLint, sin JaCoCo, sin cobertura activada en `angular.json`, sin pre-commit hooks.

---

## 🟡 MEDIO / 🟢 BAJO

- **REPO-2** Carpeta duplicada `backend/cofira/` (3 DTOs idénticos huérfanos) → borrar.
- **REPO-3** `backend/compose.yaml` redundante (tercer compose) → borrar.
- **REPO-4** `build.gradle` `group = 'com.GestionEventos'` (casing inválido) y `logging.level.com.cofira` apunta a paquete inexistente.
- **NAME-1** Paquete `com.gestioneventos.cofira` (resto de plantilla de eventos) en 423 archivos → renombrar a `com.cofira` (refactor grande, baja prioridad).
- **LANG-1** Mezcla español/inglés en modelo (`Usuario`/`UserProfile`, getters `getGender()` vs `getNombre()`, enums en inglés). Unificar idioma.
- **BE-10..** `@Transactional` ausente en escrituras de `UsuarioService`; `username` sin `unique=true`; `Map<String,String>` con `LocalDate.parse` sin validar; excepción duplicada `ResourceNotFoundException` vs `RecursoNoEncontradoException`; `RuntimeException` cruda en `ConsumoAguaService`; comentarios "qué" en repos.
- **FE-10..** Tipos `any` (4 sitios), utilidades duplicadas (`calcularEdad`/`mapearGenero` en 2 servicios), `.subscribe()` sin manejo de error (11 sitios), `<section>` usado como dropdown/overlay, escalas de `--radius` duplicadas, sin `OnPush`, `display:grid` donde basta Flexbox (regla propia).

---

## Orden de ataque recomendado

1. **Seguridad crítica + secretos** (SEC-1..4, FE-1) — lo más urgente y peligroso.
2. **Limpieza de repo** (REPO-1..4) — rápido, muy visible, desbloquea todo.
3. **Endurecimiento seguridad** (SEC-5..8) + **bug de datos** BE-1.
4. **CI con tests** (CI-1) + primeros tests reales (TEST-1/2) + linting (TEST-3).
5. **Calidad backend** (BE-2..9) y **frontend** (FE-2..9).
6. **Naming/idioma** (NAME-1, LANG-1) — refactor grande, al final.
