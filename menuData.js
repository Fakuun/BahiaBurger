'use strict';
/* =========================================================
   CATÁLOGO EDITABLE (el dueño modifica solo este archivo)
   Precios en $. Para agregar una foto: img: 'img/nombre.jpg'
   ========================================================= */
const MENU = {
  categorias: [
    { id: 'todos', nombre: 'Todos' },
    { id: 'hamburguesas', nombre: 'Hamburguesas' },
    { id: 'combos', nombre: 'Combos' },
    { id: 'acompanamientos', nombre: 'Acompañamientos' },
  ],
  tamanos: [
    { id: 'simple', nombre: 'Simple', precio: 275 },
    { id: 'doble', nombre: 'Doble', precio: 365 },
    { id: 'triple', nombre: 'Triple', precio: 455 },
  ],
  // Precios de extras de ejemplo: ajustalos a tu lista real
  extras: [
    { id: 'medallon', nombre: 'Medallón extra', precio: 90 },
    { id: 'cheddar', nombre: 'Cheddar', precio: 40 },
    { id: 'panceta', nombre: 'Panceta', precio: 50 },
    { id: 'huevo', nombre: 'Huevo frito', precio: 40 },
  ],
  productos: [
    { id: 'cheddar-burger', cat: 'hamburguesas', nombre: 'Cheddar Burger', img: '',
      ingredientes: ['Medallón 130g', 'Cheddar', 'Panceta', 'Cebolla salteada', 'Salsa Bahía'] },
    { id: 'cheese-burger', cat: 'hamburguesas', nombre: 'Cheese Burger', img: '',
      ingredientes: ['Medallón 130g', 'Muzzarella', 'Cheddar', 'Panceta', 'Cebolla salteada', 'Salsa Bahía'] },
    { id: 'dorito-burger', cat: 'hamburguesas', nombre: 'Dorito Burger', img: '',
      ingredientes: ['Medallón 130g', 'Doritos', 'Cheddar', 'Panceta', 'Cebolla crispy', 'Salsa Bahía'] },
    { id: 'criolla-burger', cat: 'hamburguesas', nombre: 'Criolla Burger', img: '',
      ingredientes: ['Medallón 130g', 'Muzzarella', 'Jamón', 'Cebolla salteada', 'Lechuga', 'Tomate', 'Salsa Bahía'] },
    { id: 'tuki-burger', cat: 'hamburguesas', nombre: 'Tuki Burger', img: '',
      ingredientes: ['Medallón 130g', 'Cheddar', 'Alioli', 'Aros de cebolla', 'Panceta'] },
    { id: 'barbacoa-burger', cat: 'hamburguesas', nombre: 'Barbacoa Burger', img: '',
      ingredientes: ['Medallón 130g', 'Barbacoa', 'Cheddar', 'Panceta', 'Cebolla crispy'] },
    { id: 'old-burger', cat: 'hamburguesas', nombre: 'Old Burger', img: '',
      ingredientes: ['Medallón 130g', 'Huevo frito', 'Lechuga', 'Tomate', 'Panceta', 'Cheddar', 'Cebolla salteada', 'Salsa Bahía'] },

    // Combos: "cantidad" = burgers a elegir, "tamano" = tamaño de cada una
    { id: 'combo-1', cat: 'combos', nombre: 'Combo 1', precio: 475, cantidad: 1, tamano: 'simple', img: '',
      ingredientes: ['1 Burger Simple a elección', 'Papas chicas', 'Refresco 600 ml'] },
    { id: 'combo-2', cat: 'combos', nombre: 'Combo 2', precio: 565, cantidad: 1, tamano: 'doble', img: '',
      ingredientes: ['1 Burger Doble a elección', 'Papas chicas', 'Refresco 600 ml'] },
    { id: 'combo-3', cat: 'combos', nombre: 'Combo 3', precio: 645, cantidad: 1, tamano: 'triple', img: '',
      ingredientes: ['1 Burger Triple a elección', 'Papas chicas', 'Refresco 600 ml'] },
    { id: 'combo-4', cat: 'combos', nombre: 'Combo 4', precio: 955, cantidad: 2, tamano: 'simple', img: '',
      ingredientes: ['2 Burgers Simples a elección', 'Papas medianas', '2 Refrescos 600 ml'] },
    { id: 'combo-5', cat: 'combos', nombre: 'Combo 5', precio: 1115, cantidad: 2, tamano: 'doble', img: '',
      ingredientes: ['2 Burgers Dobles a elección', 'Papas medianas', '2 Refrescos 600 ml'] },
    { id: 'combo-6', cat: 'combos', nombre: 'Combo 6', precio: 1295, cantidad: 2, tamano: 'triple', img: '',
      ingredientes: ['2 Burgers Triples a elección', 'Papas medianas', '2 Refrescos 600 ml'] },

    // Acompañamientos (ejemplos editables)
    { id: 'papas-chicas', cat: 'acompanamientos', nombre: 'Papas chicas', precio: 150, img: '', ingredientes: ['Porción individual'] },
    { id: 'papas-medianas', cat: 'acompanamientos', nombre: 'Papas medianas', precio: 220, img: '', ingredientes: ['Porción para compartir'] },
    { id: 'nuggets', cat: 'acompanamientos', nombre: 'Nuggets x6', precio: 230, img: '', ingredientes: ['6 unidades', 'Con salsa a elección'] },
    { id: 'refresco', cat: 'acompanamientos', nombre: 'Refresco 600 ml', precio: 120, img: '', ingredientes: ['Consultá los sabores disponibles'] },
  ],
};