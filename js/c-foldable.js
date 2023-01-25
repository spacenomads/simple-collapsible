const cFoldable = (function() {
	const SELECTORS = {
		block: '.js-foldable',
		item: '.js-foldable-item',
		trigger: '.js-foldable-trigger',
		panel: '.js-foldable-panel',
		panel_inner: '.js-foldable-panel-inner',
	};
	const LIMITS = {
		'desktop': 1280 - 1
	};


	// UTILS
	function getFoldableItemStatus(trigger) {
		const item = trigger.closest('.js-foldable-item');
		const isOpen = item.classList.contains('is-open');
		return {item, isOpen};
	}


	function setHeight(el, value) {
		el.style.height = value === 0 ? '0' : `${value}px`;
	}


	function getContentHeight(panel) {
		const innerPanel = panel.querySelector('.js-foldable-panel-inner');
		return innerPanel.offsetHeight;
	}


	function getBlockOff(block) {
		console.group('limit');
		console.log('block:', block);
		console.log('data-foldable-off:', block.dataset.foldableOff, LIMITS[block.dataset.foldableOff]);
		console.groupEnd();
		return LIMITS[block.dataset.foldableOff] || window.innerWidth;
	}





	// Foldable functions
	function openFoldable(item) {
		const block = item.closest('.js-foldable');
		const isAccordion = block.dataset.foldableAccordion === "true";
		if (isAccordion) {
			const openAccordionItems = block.querySelectorAll(':scope > .js-foldable-item.is-open');
			openAccordionItems.forEach(item => closeFoldable(item))
		}

		const blockOff = getBlockOff(block);

		if (window.innerWidth <= blockOff) {
			const panel = item.querySelector('.js-foldable-panel');
			const contentHeight = getContentHeight(panel);
			setHeight(panel, contentHeight);
			setTimeout(() => {
				item.classList.add('is-open');
				panel.style.height = null;
			}, 350);
		}
	}


	function closeFoldable(item) {
		const panel = item.querySelector('.js-foldable-panel');
		const contentHeight = getContentHeight(panel);
		setHeight(panel, contentHeight);
		setTimeout(() => {
			setHeight(panel, 0);
			setTimeout(() => {
				item.classList.remove('is-open');
			}, 350);
		}, 0);
	}


	function updateFoldableItem(event) {
		const trigger = event.currentTarget;
		const {item, isOpen} = getFoldableItemStatus(trigger);
		isOpen ? closeFoldable(item) : openFoldable(item);
	}


	function foldableInit(blocks, triggers) {
		triggers.forEach(trigger => {
			const {item, isOpen} = getFoldableItemStatus(trigger);
			const panel = item.querySelector('.js-foldable-panel');

			if (!isOpen) {
				setHeight(panel, 0);
			}

			trigger.addEventListener('click', updateFoldableItem);
		});

		blocks.forEach(block => block.classList.add('is-active'));
	}





	return {
		foldableInit,
	};
})();








window.addEventListener('DOMContentLoaded', () => {
	const foldableBlocks = document.querySelectorAll('.js-foldable');
	const foldableTriggerItems = document.querySelectorAll('.js-foldable-trigger');
	foldableBlocks && cFoldable.foldableInit(foldableBlocks,foldableTriggerItems);
});
