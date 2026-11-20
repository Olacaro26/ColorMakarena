COLORMAKARENA · Tienda web (HTML + CSS + JS)
============================================

CÓMO USARLA
1. Descomprime el .zip y abre index.html en tu navegador (doble clic).
2. Para publicarla gratis puedes subir la carpeta completa a Netlify, Vercel,
   GitHub Pages o a cualquier hosting.

⚠️ ANTES DE PUBLICAR: configura tu WhatsApp
- Abre  js/config.js  y cambia WHATSAPP_NUMBER por tu número.
  Formato: código de país + número, sin "+" ni espacios. Ejemplo (Colombia): 573001234567

ESTRUCTURA
index.html          Página principal
css/styles.css      Estilos (colores tomados del logo)
js/config.js        Número de WhatsApp y ajustes
js/products.js      Inventario (productos, precios, stock, fotos)
js/app.js           Catálogo, carrito, localStorage y envío a WhatsApp
img/                Logo y fotos de productos (optimizadas)

CÓMO ACTUALIZAR EL INVENTARIO
- Edita js/products.js: cada línea es un producto (name, category, price, stock, image).
- Para agregar un producto: copia una línea, cambia el id (único) y pon su foto en img/productos/.
- Para marcar algo como agotado: pon stock: 0.
- Categorías: "Belleza", "Cuidado personal", "Accesorios", "Juguetería" y "Productos importados".

CARRITO Y LOCALSTORAGE
- El carrito (y el nombre/nota del cliente) se guardan en el navegador con localStorage,
  así que no se pierde al recargar o cerrar la página.
- Las cantidades nunca superan el stock disponible.
- Al pulsar "Enviar pedido por WhatsApp" se abre un chat con el mensaje ya armado
  (productos, cantidades, subtotales y total).

NOTAS
- El stock mostrado = unidades iniciales − unidades vendidas del Excel.
- La página usa fuentes de Google Fonts (Playfair Display y Jost); si no hay internet usa fuentes similares.


PRODUCTOS NUEVOS
- Se agregaron 19 productos de juguetería y 10 bolsos importados desde PEDIDO JUGETERIA.xlsx.
- Los precios de venta y unidades se tomaron de las columnas correspondientes del Excel.
- Las fotos de estos 29 productos no estaban incluidas en el Excel ni en el ZIP; mientras se reciben, la tienda muestra el logo como imagen provisional. Para publicar el catálogo completo, agrega las fotos en img/productos/ y asigna sus rutas en js/products.js.
- El WhatsApp de pedidos está configurado como 573507119005 (Colombia + 3507119005).
