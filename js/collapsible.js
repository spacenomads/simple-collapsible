function getContentHeight(el) {
	const content = el.querySelector('.js__collapsible-container');
	return content.offsetHeight;
}





function openCollapsible(el) {
	const panel = el.querySelector('.js__collapsible-panel');
	const contentHeight = getContentHeight(el);
	panel.style.height = contentHeight + 'px';
	el.classList.add('collapsible--open');
}





function closeCollapsible(el) {
	const panel = el.querySelector('.js__collapsible-panel');
	panel.style.height = MINHEIGHT + 'px';
	el.classList.remove('collapsible--open');
}





function updateCollapsible(event) {
	const trigger = event.currentTarget;
	const collapsible = trigger.closest('.js__collapsible');
	const isOpen = collapsible.classList.contains('collapsible--open');
	isOpen ? closeCollapsible(collapsible) : openCollapsible(collapsible);
}





function initCollapsibles(collapsibles) {
	for (let i = 0; i < collapsibles.length; i++) {
		const collapsible = collapsibles[i];
		const trigger = collapsible.querySelector('.js__collapsible-trigger');
		const panel = collapsible.querySelector('.js__collapsible-panel');
		const isOpen = collapsible.classList.contains('collapsible--open');
		const contentHeight = getContentHeight(collapsible);

		const initialHeight = isOpen ? contentHeight : 0;
		panel.style.height = initialHeight + 'px';

		trigger.addEventListener('click', updateCollapsible);
		collapsible.classList.add('collapsible--active');
	}
}




const MINHEIGHT = 1;

const collapsibles = document.querySelectorAll('.js__collapsible');

collapsibles && initCollapsibles(collapsibles);
