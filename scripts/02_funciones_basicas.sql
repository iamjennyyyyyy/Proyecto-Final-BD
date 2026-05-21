-- Funciones básicas para validar
CREATE OR REPLACE FUNCTION validar_solo_letras_espacios()
RETURNS TRIGGER AS $$
DECLARAR
    col_nombre TEXT;
    col_valor TEXT;
BEGIN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION es_solo_letras_espacios(valor TEXT, campo_nombre TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF valor IS NOT NULL AND valor != '' THEN
        IF valor !~ '^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$' THEN
            RAISE EXCEPTION 'El campo "%" solo puede contener letras y espacios. Valor: %', campo_nombre, valor;
        END IF;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION es_solo_numeros(valor TEXT, campo_nombre TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF valor IS NOT NULL AND valor != '' THEN
        IF valor !~ '^\d+$' THEN
            RAISE EXCEPTION 'El campo "%" solo puede contener números. Valor: %', campo_nombre, valor;
        END IF;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION validar_longitud_rango(valor TEXT, campo_nombre TEXT, min_len INTEGER DEFAULT 0, max_len INTEGER DEFAULT 999)
RETURNS BOOLEAN AS $$
BEGIN
    IF valor IS NOT NULL AND valor != '' THEN
        IF LENGTH(valor) < min_len THEN
            RAISE EXCEPTION 'El campo "%" debe tener al menos % caracteres. Actual: %', campo_nombre, min_len, LENGTH(valor);
        END IF;
        IF LENGTH(valor) > max_len THEN
            RAISE EXCEPTION 'El campo "%" no puede superar los % caracteres. Actual: %', campo_nombre, max_len, LENGTH(valor);
        END IF;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION validar_longitud(valor TEXT, campo_nombre TEXT, min_max INTEGER DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF valor IS NOT NULL AND valor != '' THEN
        IF LENGTH(valor) != min_max THEN
            RAISE EXCEPTION 'El campo "%" debe tener % caracteres. Actual: %', campo_nombre, min_max, LENGTH(valor);
        END IF;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION validar_rango_numero(valor NUMERIC, campo_nombre TEXT, min_val NUMERIC DEFAULT NULL, max_val NUMERIC DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    IF valor IS NOT NULL THEN
        IF min_val IS NOT NULL AND valor < min_val THEN
            RAISE EXCEPTION 'El campo "%" no puede ser menor a %. Actual: %', campo_nombre, min_val, valor;
        END IF;
        IF max_val IS NOT NULL AND valor > max_val THEN
            RAISE EXCEPTION 'El campo "%" no puede ser mayor a %. Actual: %', campo_nombre, max_val, valor;
        END IF;
    END IF;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;