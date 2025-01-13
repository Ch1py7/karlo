# Prueba Karlo

## Descripción
Este proyecto es una prueba técnica para Karlo y consiste en una aplicación web de e-commerce. Los administradores podrán visualizar, crear, editar y eliminar productos y usuarios, así como gestionar los envíos de las órdenes. Los clientes podrán registrarse sin intervención de un administrador, agregar productos al carrito y realizar compras, mientras que el administrador (o negocio) podra agregar mas productos o devolver las ordenes.

## Tecnologías
- Frontend: React, TailwindCSS
- Backend: Node.js, Express.js
- Base de datos: PostgreSQL (ORM => Sequelize)

## Instalación
Para este proyecto se utilizó el monorepo de pnpm. Por lo que para realizar una instalación simple, se debe tener instalado pnpm. Luego, se debe ejecutar el siguiente comando en la raíz del proyecto:
```bash
pnpm install
```

En caso de no tener pnpm instalado, entrar con la consola a la carpeta `apps/frontend` y `apps/backend` de forma individual y ejecutar el comando de instalación de tu gestor de paquetes preferido.

## Ejecución
Para ejecutar el proyecto de forma local, se debe ejecutar el siguiente comando en la raíz de los proyectos:
```bash
cd apps/backend
pnpm tscs
```
```bash
cd apps/frontend
pnpm dev
```

## Demo
Para visualizar una demo del proyecto, se puede acceder al siguiente enlace: [Demo](https://karlo-phi.vercel.app/)

Se han creado dos usuarios de prueba para facilitar la visualización de la aplicación:
- Usuario administrador:
  - Correo: admin@admin.com
  - Contraseña: admin123
  - Role: admin
- Usuario común:
  - Correo: user@test.com
  - Contraseña: user1234
  - Role: user
  
## Documentación
Para visualizar la documentación de la API, se ha creado la documentación de Postman en la carpeta `apps/backend/src/docs/*.postman.json`. Tambien se han añadido las queries de creación de la base de datos en la carpeta `apps/backend/src/docs/queries.sql`.

## Notas
En este apartado detallare algunas notas adicionales sobre el proyecto, aclaraciones sobre decisiones tomadas y posibles mejoras.

### Backend
- En la documentacion de la prueba se pidio un CRUD para productos, negocios, ordenes y usuarios. Para que sea mas simple y orientativo se decidio utilizar los metodos `PUT` para actualizar, `POST` al insertar, `DELETE` al eliminar y `GET` al recuperar datos. Cada uno de estos métodos está orientado a cumplir con las buenas prácticas de REST, facilitando una gestión eficiente y clara de los productos dentro del sistema. Además, se implementan medidas de validación para garantizar la integridad de los datos enviados y recibidos, así como una gestión adecuada de los errores para brindar retroalimentación útil a los usuarios y desarrolladores.

- Para las solicitudes de eliminación se optó por utilizar el método `DELETE`. Sin embargo, en lugar de eliminar los registros de forma permanente, se incorporó un campo `is_deleted` en la entidad de productos. Esta decisión se tomó en cumplimiento con normativas que exigen la retención de datos durante un periodo determinado, asegurando así que la información no sea eliminada, sino deshabilitada dentro de la base de datos.

- Dado que se trata de un proyecto pequeño, se decidió no incluir inicialmente campos como `created_at` y `updated_at`. Si bien son útiles en sistemas más complejos para el seguimiento de cambios, en esta fase del desarrollo no se consideraron esenciales.

- Se reconoce que existe margen para implementar validaciones más robustas y un manejo más avanzado de los tokens JWT para mejorar la autenticación y autorización de usuarios. No obstante, el proyecto priorizó la entrega funcional dentro del tiempo disponible. Se utilizaron herramientas como express-validator para garantizar la integridad y seguridad de los datos, asegurando que las entradas fueran válidas y protegidas.

- Aunque el principio DRY (Don't Repeat Yourself) es una buena práctica, no se priorizó su aplicación total durante esta fase inicial del proyecto. Esto se debe a que en las primeras etapas de desarrollo se busca principalmente alcanzar la funcionalidad básica. En etapas posteriores, se planea realizar un refactor que reduzca la redundancia en el código y optimice su mantenibilidad.

- Aunque se intentó cubrir todos los casos posibles, algunos mensajes de error son demasiado generales y no proporcionan suficiente información al frontend. Con más tiempo, sería posible hacerlos más detallados y agregar códigos de error personalizados, lo que facilitaría la identificación de problemas y mejoraría el manejo de los mismos desde el lado del cliente.

### Frontend
- Se ha seguido una práctica adecuada en cuanto al manejo de estados dentro de la aplicación. Sin embargo, debido a las limitaciones de tiempo, no se profundizó en las mejores prácticas para su implementación en React. Como resultado, existen oportunidades para mejorar la gestión de estados globales y locales. En este aspecto, cometí el error de no haber leído sobre el uso de Redux en la prueba, lo que me llevó a tomar decisiones rápidas con el tiempo restante.

## Autenticacion
- En la documentación de la prueba, se solicitaba la implementación de un sistema de autenticación. Se creó un panel simple para permitir el registro y acceso de usuarios, ya sea como administrador (negocio) o cliente.


### Despliegue
- Para el despliegue de la aplicación se ha utilizado Vercel para el frontend y Render para el backend. Se ha utilizado Vercel para el frontend debido a que es una plataforma que facilita el despliegue de aplicaciones React. Por otro lado, se ha utilizado Render debido a que actualmente es una de las pocas plataformas que permite el despliegue de aplicaciones Node.js de forma gratuita y sencilla.


## Autor
- [Gerardo Garcia](https://github.com/Ch1py7)