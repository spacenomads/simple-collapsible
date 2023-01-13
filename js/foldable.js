const FOLDABLE_SELECTORS = {
	block: '.js-foldable',
	item: '.js-foldable-item',
	trigger: '.js-foldable-trigger',
	panel: '.js-foldable-panel',
	panel_inner: '.js-foldable-panel-inner',
};

// UTILS
function getFoldableItemStatus(trigger) {
	const item = trigger.closest('.js-foldable-item');
	const isOpen = item.classList.contains('is-open');

	return {item, isOpen};
}


function setHeight(el, value) {
	const height = value === 0 ? '0' : `${value}px`;
	el.style.height = height;
}


function getContentHeight(panel) {
	const innerPanel = panel.querySelector('.js-foldable-panel-inner');
  return innerPanel.offsetHeight;
}


// Foldable functions
function openFoldable(item) {
	// [x] Me abro
	// [] Comprobar si soy un acordeon
	// [] Si lo soy -> cierro los demás
	// [x] Calcular el tamaño del panel
	// 	[x] y asignarselo
	const panel = item.querySelector('.js-foldable-panel');
	const contentHeight = getContentHeight(panel);
	setHeight(panel, contentHeight);
	setTimeout(() => {
		// [x] Coloco la clase is-open
		item.classList.add('is-open');
		// [x] Eliminar el tamaño del panel
		panel.style.height = null;
	}, 350);
}


function closeFoldable(item) {
	// [x] Me cierro
	// [x] Poner el tamaño del panel a 0
	const panel = item.querySelector('.js-foldable-panel');
	const contentHeight = getContentHeight(panel);
	setHeight(panel, contentHeight);
	setTimeout(() => {
		setHeight(panel, 0);
		setTimeout(() => {
			item.classList.remove('is-open');
		}, 350);
	}, 0);
	// [x] Elimino la clase is-open

}


function updateFoldableItem(event) {
	// [x] Comprobar si estoy abierto o cerrado
	const trigger = event.currentTarget;
	const {item, isOpen} = getFoldableItemStatus(trigger);
	// [x] Me abro si estoy cerrado
	// [x] Me cierro si estoy abierto
	isOpen ? closeFoldable(item) : openFoldable(item);
}


function foldableInit(blocks, triggers) {
	triggers.forEach(trigger => {
		// [x] Revisar si alguno debe estar abierto.
		const {item, isOpen} = getFoldableItemStatus(trigger);
		const panel = item.querySelector('.js-foldable-panel');


		if (!isOpen) {
			setHeight(panel, 0);
		}

		// [x] Asignar listener a los triggers
		trigger.addEventListener('click', updateFoldableItem);
	});
	// [x] Colocar clase de activo
	blocks.forEach(block => block.classList.add('is-active'));
}


window.addEventListener('load', () => {
	const foldableBlocks = document.querySelectorAll('.js-foldable');
	const foldableTriggerItems = document.querySelectorAll('.js-foldable-trigger');
	foldableBlocks && foldableInit(foldableBlocks,foldableTriggerItems);
});
