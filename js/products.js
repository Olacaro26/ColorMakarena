/* ============================================================
   INVENTARIO (generado desde inventario_inicial_del_negocio.xlsx)
   stock = unidades iniciales − unidades vendidas
   Para agregar o editar productos, modifica esta lista.
   category: "Belleza" | "Cuidado personal" | "Accesorios"
   image: ruta de la foto (null = se muestra el logo)
   ============================================================ */
const PRODUCTS = [
  { id: 3,  name: "BB Cream con aplicador de esponja 30 g", ref: "",            category: "Belleza",          price: 7000,  stock: 10, image: "img/productos/p03.webp" },
  { id: 4,  name: "Cepillo de oso",                         ref: "JA0241",      category: "Accesorios",       price: 8000,  stock: 10, image: "img/productos/p04.webp" },
  { id: 5,  name: "Emulsión anti-edad ácido hialurónico Sadoer", ref: "SD-05847", category: "Cuidado personal", price: 6000, stock: 10, image: "img/productos/p05.webp" },
  { id: 6,  name: "Gel de cejas tattoo Olibolla",           ref: "LA-E209",     category: "Belleza",          price: 6000,  stock: 9,  image: "img/productos/p06.webp" },
  { id: 7,  name: "Peinilla",                               ref: "855A",        category: "Accesorios",       price: 3500,  stock: 20, image: "img/productos/p07.webp" },
  { id: 8,  name: "Pinza para cabello (1 unidad)",          ref: "JA0678",      category: "Accesorios",       price: 3000,  stock: 9,  image: "img/productos/p08.webp" },
  { id: 9,  name: "Pinza para cabello (1 unidad)",          ref: "JA0676",      category: "Accesorios",       price: 3000,  stock: 10, image: "img/productos/p09.webp" },
  { id: 10, name: "Rubor 2 en 1 Olibolla",                  ref: "",            category: "Belleza",          price: 7000,  stock: 10, image: "img/productos/p10.webp" },
  { id: 11, name: "Set de brochas x 5",                     ref: "LDC003",      category: "Belleza",          price: 12000, stock: 10, image: "img/productos/p11.webp" },
  { id: 12, name: "Tónico anti-edad ácido hialurónico Sadoer", ref: "SD-05830", category: "Cuidado personal", price: 6000, stock: 10, image: "img/productos/p12.webp" },
  { id: 13, name: "Balaca Skincare con moño",               ref: "JA0885",      category: "Cuidado personal", price: 6000,  stock: 5,  image: "img/productos/p13.webp" },
  { id: 14, name: "Borla de terciopelo corazón",            ref: "1307",        category: "Belleza",          price: 3000,  stock: 6,  image: "img/productos/p14.webp" },
  { id: 15, name: "Corrector de ojeras con aplicador Handaiyan", ref: "H3015-1", category: "Belleza",         price: 5000,  stock: 12, image: "img/productos/p15.webp" },
  { id: 16, name: "Cosmetiquera classic trenzada",          ref: "JA1248",      category: "Accesorios",       price: 12000, stock: 4,  image: "img/productos/p16.webp" },
  { id: 17, name: "Cosmetiquera de peluche corazones",      ref: "JA1246",      category: "Accesorios",       price: 12000, stock: 5,  image: "img/productos/p17.webp" },
  { id: 18, name: "Encrespador de pestañas",                ref: "JA0959",      category: "Belleza",          price: 7000,  stock: 5,  image: "img/productos/p18.webp" },
  { id: 19, name: "Iluminador Shell Bling Olibolla",        ref: "LAH322",      category: "Belleza",          price: 8000,  stock: 5,  image: "img/productos/p19.webp" },
  { id: 20, name: "Kit spa 4 piezas brillos",               ref: "JA1352",      category: "Cuidado personal", price: 15000, stock: 5,  image: "img/productos/p20.webp" },
  { id: 21, name: "Kit spa 4 piezas degradé",               ref: "JA1355",      category: "Cuidado personal", price: 15000, stock: 5,  image: "img/productos/p21.webp" },
  { id: 22, name: "Labial hidratante mate Gege Bear",       ref: "GX1106-926",  category: "Belleza",          price: 3000,  stock: 25, image: "img/productos/p22.webp" },
  { id: 23, name: "Lip gloss con color Jirafa",             ref: "",            category: "Belleza",          price: 3000,  stock: 4,  image: "img/productos/p23.webp" },
  { id: 24, name: "Lip oil hidratante Gege Bear (tapa osito)", ref: "",         category: "Belleza",          price: 3000,  stock: 9,  image: "img/productos/p24.webp" },
  { id: 25, name: "Mini plancha portátil Mabe",             ref: "",            category: "Accesorios",       price: 15000, stock: 5,  image: "img/productos/p25.webp" },
  { id: 26, name: "Pestañina maxi volumen Prosa (sin empaque)", ref: "15191",   category: "Belleza",          price: 20000, stock: 5,  image: "img/productos/p26.webp" },
  { id: 27, name: "Sérum ácido hialurónico Bioaqua 30 ml",  ref: "BQY37374",    category: "Cuidado personal", price: 5000,  stock: 5,  image: "img/productos/p27.webp" },
  { id: 28, name: "Pestañas postizas Cappuvini",            ref: "J01-04",      category: "Belleza",          price: 6000,  stock: 5,  image: "img/productos/p28.webp" },
  { id: 29, name: "Sérum de vitamina C con ácido hialurónico Bioaqua", ref: "", category: "Cuidado personal", price: 5000, stock: 5, image: "img/productos/p29.webp" },
  { id: 30, name: "Set de mini brochas x 6",                ref: "CTG-1002",    category: "Belleza",          price: 10000, stock: 4,  image: "img/productos/p30.webp" },
  { id: 31, name: "Tinta de labios Gege Bear osito",        ref: "",            category: "Belleza",          price: 3000,  stock: 15, image: "img/productos/p31.webp" },
  { id: 32, name: "Mini Bloom Fresh (paquete x 2)",         ref: "",            category: "Cuidado personal", price: 1500,  stock: 38, image: "img/productos/p32.webp" },
  { id: 36, name: "Llavero de peluche rosado",              ref: "",            category: "Accesorios",       price: 10000, stock: 6,  image: "img/productos/p36.webp" },
  { id: 37, name: "Llavero de peluche con gafas",           ref: "",            category: "Accesorios",       price: 10000, stock: 4,  image: "img/productos/p37.webp" },
  { id: 38, name: "Tarro de plástico Stitch",               ref: "",            category: "Accesorios",       price: 17000, stock: 1,  image: "img/productos/p38.webp" },
  { id: 39, name: "Organizador de tocador",                 ref: "",            category: "Accesorios",       price: 20000, stock: 3,  image: "img/productos/p39.webp" },
  { id: 40, name: "Lapicero de personajes (sin luz)",       ref: "",            category: "Accesorios",       price: 5000,  stock: 4,  image: "img/productos/p40.webp" },
  { id: 41, name: "Lapicero de capibara",                   ref: "",            category: "Accesorios",       price: 5000,  stock: 3,  image: "img/productos/p41.webp" },
  { id: 42, name: "Tarro de plástico Snoopy",               ref: "",            category: "Accesorios",       price: 17000, stock: 3,  image: "img/productos/p42.webp" },
  { id: 43, name: "Organizador con sticker",                ref: "",            category: "Accesorios",       price: 25000, stock: 2,  image: null }
];
