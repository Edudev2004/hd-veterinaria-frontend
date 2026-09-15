create extension if not exists pgcrypto;

create table roles (
    id          uuid primary key default gen_random_uuid(),
    nombre      varchar(50) not null unique,
    descripcion text,
    created_at  timestamptz not null default now()
);

create table usuarios (
    id            uuid primary key default gen_random_uuid(),
    nombre        varchar(100) not null,
    email         varchar(150) not null unique,
    password_hash text not null,
    rol_id        uuid not null references roles(id),
    activo        boolean not null default true,
    created_at    timestamptz not null default now()
);

create index idx_usuarios_email on usuarios(email);
create index idx_usuarios_rol on usuarios(rol_id);

create table propietarios (
    id         uuid primary key default gen_random_uuid(),
    usuario_id uuid not null unique references usuarios(id) on delete cascade,
    telefono   varchar(20),
    direccion  varchar(200)
);

create table especialidades (
    id     uuid primary key default gen_random_uuid(),
    nombre varchar(100) not null unique
);

create table veterinarios (
    id              uuid primary key default gen_random_uuid(),
    usuario_id      uuid not null unique references usuarios(id) on delete cascade,
    especialidad_id uuid not null references especialidades(id),
    activo          boolean not null default true
);

create index idx_veterinarios_especialidad on veterinarios(especialidad_id);

create table horarios_disponibilidad (
    id              uuid primary key default gen_random_uuid(),
    veterinario_id  uuid not null references veterinarios(id) on delete cascade,
    dia_semana      smallint not null check (dia_semana between 0 and 6),
    hora_inicio     time not null,
    hora_fin        time not null,
    check (hora_fin > hora_inicio)
);

create index idx_horarios_veterinario on horarios_disponibilidad(veterinario_id);

create table mascotas (
    id               uuid primary key default gen_random_uuid(),
    propietario_id   uuid not null references propietarios(id) on delete cascade,
    nombre           varchar(100) not null,
    especie          varchar(50) not null,
    raza             varchar(50),
    fecha_nacimiento date,
    foto_url         text,
    created_at       timestamptz not null default now()
);

create index idx_mascotas_propietario on mascotas(propietario_id);

create table citas (
    id             uuid primary key default gen_random_uuid(),
    mascota_id     uuid not null references mascotas(id) on delete cascade,
    veterinario_id uuid not null references veterinarios(id),
    fecha_hora     timestamptz not null,
    estado         varchar(20) not null default 'pendiente'
                   check (estado in ('pendiente', 'atendida', 'no_atendida', 'cancelada')),
    motivo         text,
    created_at     timestamptz not null default now()
);

create index idx_citas_mascota on citas(mascota_id);
create index idx_citas_veterinario on citas(veterinario_id);
create index idx_citas_fecha on citas(fecha_hora);

create table diagnosticos (
    id          uuid primary key default gen_random_uuid(),
    cita_id     uuid not null unique references citas(id) on delete cascade,
    diagnostico text not null,
    datos       text,
    tratamiento text,
    notas       text,
    created_at  timestamptz not null default now()
);

create table valoraciones (
    id          uuid primary key default gen_random_uuid(),
    cita_id     uuid not null unique references citas(id) on delete cascade,
    puntuacion  smallint not null check (puntuacion between 1 and 5),
    comentario  text,
    created_at  timestamptz not null default now()
);

create table notificaciones (
    id         uuid primary key default gen_random_uuid(),
    usuario_id uuid not null references usuarios(id) on delete cascade,
    mensaje    text not null,
    leido      boolean not null default false,
    created_at timestamptz not null default now()
);

create index idx_notificaciones_usuario on notificaciones(usuario_id);