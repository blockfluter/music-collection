function copy(element, name)
{
	document.getElementById(name).value = element.value;
}

window.onload = (event) => {
	setTimeout(() => {
		Array.prototype.forEach.call(document.getElementsByClassName('status1'), e => {
			e.classList.remove('status1');
		});
	},1000);
}

function loadRow(tr) {
	Array.prototype.forEach.call(tr.getElementsByTagName('td'), e => {
		document.getElementById(e.dataset.key).value = e.innerText;	
	});
}