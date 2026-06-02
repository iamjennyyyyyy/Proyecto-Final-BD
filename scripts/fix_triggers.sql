-- Fix 1: actualizar_cantidad_materiales — use correct column name
create or replace function actualizar_cantidad_materiales()
language plpgsql
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update materiales
    set cantidad = cantidad - new.cantidadmaterialutilizado
    where idmaterial = new.idmaterial;
  end if;

  return new;
end;
$$;

-- Fix 2: verificar_cantidad_suficiente — check the specific material being inserted
create or replace function verificar_cantidad_suficiente()
language plpgsql
returns trigger as $$
declare
  cantidad_actual integer;
begin
  select cantidad
  into cantidad_actual
  from materiales
  where idmaterial = new.idmaterial;

  if new.cantidadmaterialutilizado > cantidad_actual then
    raise exception 'La cantidad actual del material es insuficiente';
  end if;

  return new;
end;
$$;
