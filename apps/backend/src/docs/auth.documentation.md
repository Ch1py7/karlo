## Login User
- Endpoint: /api/auth/login
- Método: POST
- Descripción: Autentica a un usuario existente con su correo electrónico y contraseña. Este te manda error si esta el correo o contraseña erroneo, lo mismo si intentas acceder a tu cuenta sin haberte verificado

- Headers:
Ninguno.

- Body:
Formato: JSON

```json
{
  "email": "abc@abc.abc",
  "password": "juasjuas"
}
```

URL Completa:
`https://karlo.onrender.com/api/auth/login`

-------------------------------------------------------------------------------------------------------------------------------

## Create User
- Endpoint: /api/auth/register
- Método: POST
- Descripción: Registra un nuevo usuario en la aplicación. Al registrarse se envia un codigo de verificacion para posteriormente validar y habilitar el acceso a tu cuenta

- Headers:
Ninguno.

- Body:
Formato: JSON

```json
{
  "id": "9305f956-7499-4731-b12d-7ee9273744ff",
  "name": "pikmin",
  "password": "juasjuas",
  "email": "abc@abc.abc",
  "role_id": 1
}
```

 URL Completa:
`https://karlo.onrender.com/api/auth/register`

-------------------------------------------------------------------------------------------------------------------------------

## Validate User
- Endpoint: /api/auth/validate
- Método: PUT
- Descripción: Valida un usuario con un código de validación asociado a su correo electrónico.

- Headers:
Ninguno.

- Body:
Formato: JSON

```json
{
  "email": "abc@abc.abc",
  "validation_code": "397910"
}
```
- URL Completa:
`https://karlo.onrender.com/api/auth/validate`

-------------------------------------------------------------------------------------------------------------------------------

- Recover Token
- Endpoint: /api/auth/recover
- Método: GET
- Descripción: Recupera un token de acceso para un usuario proporcionando su correo electrónico y contraseña.

- Headers:
Ninguno.

- Query Parameters:

email: el@enou.drai
password: draidrai

- URL Completa:
`https://karlo.onrender.com/api/auth/recover?email=el@enou.drai&password=draidrai`

