const cFoldable = (function () {
	const SELECTORS = {
		block: '.js-foldable',
		item: '.js-foldable-item',
		heading: '.js-foldable-heading',
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
		return { item, isOpen };
	}


	function setHeight(el, value) {
		el.style.height = value === 0 ? '0' : `${value}px`;
	}


	function getContentHeight(panel) {
		const innerPanel = panel.querySelector('.js-foldable-panel-inner');
		return innerPanel.offsetHeight;
	}


	function getBlockOff(block) {
		return LIMITS[block.dataset.foldableOff];
	}


	function recoverfocus(elem) {
		if (elem.dataset.tabIndex) {
			elem.tabIndex = elem.dataset.tabIndex;
			elem.removeAttribute('data-tab-index');
		} else {
			elem.removeAttribute('tabindex');
		}
		elem.removeAttribute('data-unfocusable');
	}


	function addFocusablePanelElemsBack(panel) {
		if (panel) {
			const mainFoldableItem = panel.closest('.js-foldable-item');
			const FOCUSABLE_ELEMS = [...panel.querySelectorAll('[data-unfocusable]')]
				.filter(elm => {
					const elmfoldableItem = elm.closest('.js-foldable-item');
					return elmfoldableItem === mainFoldableItem;
				});

			FOCUSABLE_ELEMS.forEach(function(elem){
				recoverfocus(elem);
			});
		}
	};


	function setOpenedFoldable(panel, item) {
		setTimeout(() => {
			panel.style.height = null;
			item.classList.add('is-open');

			const DIRECT_ITEMS = panel.querySelectorAll(':scope > .js-foldable-panel-inner > .js-foldable > .js-foldable-item');
			DIRECT_ITEMS.forEach(function(item){
				recoverfocus(item.querySelector('.js-foldable-trigger'));
			});
		}, 350);
	}

	// Foldable functions
	function openFoldable(item) {
		const block = item.closest('.js-foldable');
		const isAccordion = block.dataset.foldableAccordion === "true";
		const blockOff = getBlockOff(block);
		const panel = item.querySelector('.js-foldable-panel');
		const trigger = item.querySelector('.js-foldable-trigger');

		if (isAccordion) {
			const openAccordionItems = block.querySelectorAll(':scope > .js-foldable-item.is-open');
			openAccordionItems.forEach(item => closeFoldable(item))
		}

		if (!blockOff || window.innerWidth <= blockOff) {
			const contentHeight = getContentHeight(panel);
			trigger.setAttribute('aria-expanded', 'true');
			// TODO: activar los elementos focusables del panel y de cada panel abierto interior
			addFocusablePanelElemsBack(panel);
			setHeight(panel, contentHeight);
			setOpenedFoldable(panel, item);
		}
	}


	function closeFoldable(item) {
		// TODO: Desactivar los tabindex del contenido
		const panel = item.querySelector('.js-foldable-panel');
		const contentHeight = getContentHeight(panel);
		const trigger = item.querySelector('.js-foldable-trigger');
		trigger.setAttribute('aria-expanded', 'false');
		removeFocusableElemsFromNavigation(panel);
		setHeight(panel, contentHeight);
		setTimeout(() => {
			setHeight(panel, 0);
			setTimeout(() => {
				item.classList.remove('is-open');
			}, 350);
		}, 0);

		const INTERNAL_OPEN_ITEMS = panel.querySelectorAll('.js-foldable-item.is-open');
		INTERNAL_OPEN_ITEMS.length && INTERNAL_OPEN_ITEMS.forEach(item => closeFoldable(item));
	}


	function updateFoldableItem(event) {
		const trigger = event.currentTarget;
		const block = trigger.closest('.js-foldable');
		const blockOff = getBlockOff(block);
		if (blockOff && window.innerWidth > blockOff) {
			event.preventDefault();
		} else {
			const { item, isOpen } = getFoldableItemStatus(trigger);
			isOpen ? closeFoldable(item) : openFoldable(item);
		}
	}


	function updateFoldableLimitedBlocks(block, status) {

		const triggers = block.querySelectorAll(':scope > .js-foldable-item > .js-foldable-heading > .js-foldable-trigger');
		if (status === 'enable') {
			triggers.forEach(trigger => {
				trigger.removeAttribute('disabled');
			});
		} else {
			triggers.forEach(trigger => {
				const panel = trigger.closest('.js-foldable-item').querySelector('.js-foldable-panel');
				trigger.setAttribute('disabled', 'disabled');
				trigger.setAttribute('aria-expanded', true);
				panel.removeAttribute('style');
				// TODO: activar los elementos focusables del panel y de cada panel abierto interior
				addFocusablePanelElemsBack(panel);
			});
		}
	}


	function closeAllClosableItems() {
		const autoFoldableBlocks = document.querySelectorAll('.js-foldable[data-autofoldable]');
		autoFoldableBlocks.forEach(block => {
			const items = block.querySelectorAll(':scope > .js-foldable-item');
			items.forEach(item => closeFoldable(item));
		});
	}


	function updateFoldableLimitedBlock(block) {
		const blockOff = getBlockOff(block);
		const isMediaLimit = blockOff ? window.matchMedia(`(min-width: ${blockOff + 1}px)`).matches : false;

		const hasLimit = block.classList.contains('has-active-limit');
		if (isMediaLimit) {
			if (!hasLimit) {
				block.classList.add('has-active-limit');
				updateFoldableLimitedBlocks(block, 'disable');
			}
		} else if (hasLimit) {
			block.classList.remove('has-active-limit');
			updateFoldableLimitedBlocks(block, 'enable');
			closeAllClosableItems();
		}
	};


	function updateFoldableBlocksOnResize() {
		const foldableLimitedBlocks = [...document.querySelectorAll('.js-foldable[data-foldable-off]')].filter(block => block.dataset.foldableOff);
		foldableLimitedBlocks.forEach(updateFoldableLimitedBlock);
	}


	function initTrigger(trigger) {
		const { item, isOpen } = getFoldableItemStatus(trigger);
		const panel = item.querySelector('.js-foldable-panel');
		const block = item.closest('.js-foldable');
		const blockOff = getBlockOff(block);
		const isLimitActive = blockOff && window.innerWidth > blockOff;
		if (!isOpen && !isLimitActive) {
			setHeight(panel, 0);
			removeFocusableElemsFromNavigation(panel);
		}

		trigger.setAttribute('aria-expanded', isOpen);

		if (isLimitActive) {
			trigger.setAttribute('disabled', 'disabled');
			trigger.setAttribute('aria-expanded', true);
			panel.removeAttribute('style');
		}
		trigger.addEventListener('click', updateFoldableItem);
	}


	function foldableInit(blocks, triggers) {
		triggers.forEach(initTrigger);
		blocks.forEach(block => block.classList.add('is-active'));
		window.addEventListener('resize', updateFoldableBlocksOnResize);

	}


	return {
		foldableInit,
	};
})();

window.addEventListener('DOMContentLoaded', () => {
	const foldableBlocks = document.querySelectorAll('.js-foldable');
	const foldableTriggerItems = document.querySelectorAll('.js-foldable-trigger');
	foldableBlocks && cFoldable.foldableInit(foldableBlocks, foldableTriggerItems);
});



const removeFocusableElemsFromNavigation = function(elem) {
	if (elem) {
		const FOCUSABLE_ELEMS = elem.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		FOCUSABLE_ELEMS.forEach(function(elem){
			if (elem.tabIndex && !elem.dataset.tabIndex) {
				elem.dataset.tabIndex = elem.tabIndex;
			}
			elem.setAttribute('tabindex', '-1');
			elem.setAttribute('data-unfocusable', 'true');
		});
	}
};

