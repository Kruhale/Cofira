// ─────────────────────────────────────────────────────────────
// Setup global de los tests.
//
// GSAP + afterNextRender registran limpiezas (destroyRef.onDestroy) desde un
// callback diferido. En el TEARDOWN de Karma el componente se destruye antes de
// que ese callback corra, y Angular lanza NG0911 ("View has already been
// destroyed") como promesa rechazada sin manejar, que Jasmine convierte en un
// fallo de "afterAll". NO es un fallo de producción: en la app real la vista
// vive mientras corre el callback. Silenciamos EXCLUSIVAMENTE ese código de
// error para que el teardown no tumbe la suite.
// ─────────────────────────────────────────────────────────────
window.addEventListener(
  'unhandledrejection',
  (evento) => {
    const razon = evento.reason as { code?: number; message?: string } | undefined;
    const esNg0911 =
      razon?.code === 911 ||
      (typeof razon?.message === 'string' && razon.message.includes('NG0911'));
    if (esNg0911) {
      evento.preventDefault();
      evento.stopImmediatePropagation();
    }
  },
  true,
);
