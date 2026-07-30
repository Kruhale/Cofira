package com.cofira.dto.gimnasio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MotivacionDTO {

    private String comentario;
    private String consejo;
}
