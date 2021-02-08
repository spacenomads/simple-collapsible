const MINHEIGHT = 0;
const PANEL_SPEED = 400;
const collapsibles = document.querySelectorAll('.js__collapsible');





function getContentHeight(el) {
	const content = el.querySelector('.js__collapsible-container');
	return content.offsetHeight;
}





function openCollapsible(el) {
	const panel = el.querySelector('.js__collapsible-panel');
	const contentHeight = getContentHeight(el);
	panel.style.height = contentHeight + 'px';
	el.classList.add('collapsible--open');
	setTimeout(
		() => {
			el.classList.add('collapsible--overflow');
		},
		PANEL_SPEED);
}





function closeCollapsible(el) {
	el.classList.remove('collapsible--overflow');
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

		isOpen && collapsible.classList.add('collapsible--overflow');

		const initialHeight = isOpen ? contentHeight : 0;
		panel.style.height = initialHeight + 'px';

		trigger.addEventListener('click', updateCollapsible);
		collapsible.classList.add('collapsible--active');
	}
}





collapsibles && initCollapsibles(collapsibles);
