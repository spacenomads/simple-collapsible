const FOLDABLE_SELECTORS = {
	block: '.js-foldable',
	item: '.js-foldable-item',
	trigger: '.js-foldable-trigger',
	panel: '.js-foldable-panel',
	panel_inner: '.js-foldable-panel-inner',
};


function getFoldableItemStatus(trigger) {
	const item = trigger.closest('.js-foldable-item');
	const isOpen = item.classList.contains('is-open');

	return {item, isOpen};
}


function openFoldable(item) {
	// [] Me abro
	// [] Comprobar si soy un acordeon
	// [] Si lo soy -> cierro los demás
	// [] Calcular el tamaño del panel
	// 	[] y asignarselo
	// [x] Coloco la clase is-open
	item.classList.add('is-open');
	// [] Eliminar el tamaño del panel
}


function closeFoldable(item) {
	// [] Me cierro
	// [] Poner el tamaño del panel a 0
	// [x] Elimino la clase is-open
	item.classList.remove('is-open');
}


function updateFoldableItem(event) {
	// [] Comprobar si estoy abierto o cerrado
	const trigger = event.currentTarget;
	const {item, isOpen} = getFoldableItemStatus(trigger);
	// [] Me abro si estoy cerrado
	// [] Me cierro si estoy abierto
	isOpen ? closeFoldable(item) : openFoldable(item);
}


function foldableInit(blocks, triggers) {



	triggers.forEach(trigger => {
		// [x] Revisar si alguno debe estar abierto.
		const {item, isOpen} = getFoldableItemStatus(trigger);
		const panel = item.querySelector('.js-foldable-panel');

		if (!isOpen) {
			panel.style.height = '0';
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
