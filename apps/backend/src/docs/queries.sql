CREATE TABLE roles (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	key VARCHAR(25) NOT NULL
);

CREATE TABLE iva (
	id SERIAL PRIMARY KEY,
  tax INTEGER NOT NULL
);
INSERT INTO iva (tax) VALUES (16);

CREATE TABLE status (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	key VARCHAR(25) NOT NULL
);

CREATE TABLE negocios (
	id UUID primary key,
	name TEXT not null UNIQUE,
	is_deleted BOOL NOT NULL
);

CREATE TABLE usuarios (
	id UUID PRIMARY KEY,
	name TEXT,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	role_id SERIAL NOT NULL,
	is_validated BOOL NOT NULL,
	validation_code TEXT,
	is_deleted BOOL NOT NULL,
	FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE productos (
	id UUID PRIMARY KEY,
	business_id UUID NOT NULL,
	name TEXT NOT NULL,
	stock INTEGER NOT NULL,
	price FLOAT8 NOT NULL,
	is_deleted BOOL NOT NULL,
	FOREIGN KEY (business_id) REFERENCES negocios (id)
);

CREATE TABLE orden_compra (
	id UUID PRIMARY KEY,
	business_id UUID NOT NULL,
	user_id UUID NOT NULL,
	status SERIAL NOT NULL,
	total FLOAT8 NOT NULL,
	subtotal FLOAT8 NOT NULL,
	tax FLOAT8 NOT NULL,
	products TEXT NOT NULL,
	FOREIGN KEY (business_id) REFERENCES negocios (id),
	FOREIGN KEY (user_id) REFERENCES usuarios (id)
);

INSERT INTO roles (name, key)
VALUES 
  ('Negocio', 'business_rol'),
  ('Cliente', 'client_rol');

INSERT INTO status (name, key)
VALUES 
  ('Pendiente', 'pending'),
  ('Pagado', 'paid'),
  ('Devuelto', 'returned'),
  ('Cancelado', 'cancelled');