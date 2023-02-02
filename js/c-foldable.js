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
		// console.group('limit');
		// console.log('block:', block);
		// console.log('data-foldable-off:', block.dataset.foldableOff, LIMITS[block.dataset.foldableOff]);
		// console=groupEnd();
		return LIMITS[block.dataset.foldableOff];
	}

	// Foldable functions
	function openFoldable(item) {
		// TODO: Activar los tabindex de los elementos abiertos anidados
		const block = item.closest('.js-foldable');
		const isAccordion = block.dataset.foldableAccordion === "true";
		if (isAccordion) {
			const openAccordionItems = block.querySelectorAll(':scope > .js-foldable-item.is-open');
			openAccordionItems.forEach(item => closeFoldable(item))
		}

		const blockOff = getBlockOff(block);
		const panel = item.querySelector('.js-foldable-panel');
		const trigger = item.querySelector('.js-foldable-trigger');

		if (!blockOff || window.innerWidth <= blockOff) {
			const contentHeight = getContentHeight(panel);
			trigger.setAttribute('aria-expanded', 'true');
			setHeight(panel, contentHeight);
			setTimeout(() => {
				item.classList.add('is-open');
				panel.style.height = null;
			}, 350);
		}
	}

	function closeFoldable(item) {
		// TODO: Desactivar los tabindex del contenido
		const panel = item.querySelector('.js-foldable-panel');
		const contentHeight = getContentHeight(panel);
		const trigger = item.querySelector('.js-foldable-trigger');
		trigger.setAttribute('aria-expanded', 'false');
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
		const block = trigger.closest('.js-foldable');
		const blockOff = getBlockOff(block);
		if (blockOff && window.innerWidth > blockOff) {
			event.preventDefault();
		} else {
			const {item, isOpen} = getFoldableItemStatus(trigger);
			isOpen ? closeFoldable(item) : openFoldable(item);
		}
	}

	function foldableInit(blocks, triggers) {
		triggers.forEach(trigger => {
			const {item, isOpen} = getFoldableItemStatus(trigger);
			const panel = item.querySelector('.js-foldable-panel');
			const block = item.closest('.js-foldable');
			const blockOff = getBlockOff(block);

			if (!isOpen) {
				setHeight(panel, 0);
			}

			trigger.setAttribute('aria-expanded', isOpen);

			if (blockOff && window.innerWidth > blockOff) {
				trigger.setAttribute('disabled', 'disabled');
			}
			trigger.addEventListener('click', updateFoldableItem);

		});

		blocks.forEach(block => block.classList.add('is-active'));

		function updateFoldableLimitedTriggers(block, status) {

				const triggers = block.querySelectorAll(':scope > .js-foldable-item > .js-foldable-heading > .js-foldable-trigger');
				if (status === 'enable') {
					console.log('enable')
					triggers.forEach(trigger => {
						trigger.removeAttribute('disabled');
						trigger.classList.remove('disabled-class');
					});
				} else {
					console.log('disable')
					triggers.forEach(trigger => {
						trigger.setAttribute('disabled', 'disabled');
						trigger.classList.add('disabled-class');
					});
				}
		}


		function closeAllClosableItems() {
			const autoFoldableBlocks = document.querySelectorAll('.js-foldable[data-autofoldable]');

			autoFoldableBlocks.forEach(block => {
				const items = block.querySelectorAll(':scope > .js-foldable-item');
				items.forEach(item =>closeFoldable(item) );
			});
		}


		function updateFoldableBlocksOnResize() {
			const foldableLimitedBlocks = [...document.querySelectorAll('.js-foldable[data-foldable-off]')].filter(block => block.dataset.foldableOff);

			foldableLimitedBlocks.forEach(block => {
				const blockOff = getBlockOff(block);
				const isMediaLimit = blockOff ? window.matchMedia(`(min-width: ${blockOff + 1}px)`).matches : false;

				const hasLimit = block.classList.contains('has-active-limit');
				if (isMediaLimit) {
					if (!hasLimit) {
						block.classList.add('has-active-limit');
						updateFoldableLimitedTriggers(block, 'disable');
					}
				} else {
					if (hasLimit) {
						block.classList.remove('has-active-limit');
						updateFoldableLimitedTriggers(block, 'enable');
						closeAllClosableItems()
					}
				}
			});
		}

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

