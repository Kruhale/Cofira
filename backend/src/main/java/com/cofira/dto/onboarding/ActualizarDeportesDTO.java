package com.cofira.dto.onboarding;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActualizarDeportesDTO {

    private List<String> sports;
    private List<String> equipment;
}
