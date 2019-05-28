# mercadolibre-busqueda
Ejecuta busqueda en mercadolibre ( usuarios, productos, visitas, etc ) y devuelve todos los offset en caso de que
los resultados de la busqueda superen el limite de 50 items.

## Dependencias
request-promise >= 4.2.4

## Uso

# Inicializar
const mercadolibreBusqueda = requiere('mercadolibre-busqueda') ;

# Usuarios

* Con access_token:
    mercadolibreBusqueda.user.get('$userId','&access_token')
* Con access_token:
    mercadolibreBusqueda.user.get('$userId')