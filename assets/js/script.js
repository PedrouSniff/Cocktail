const navItems = document.querySelectorAll('.nav-item');
navItems[0].classList.add('active');

navItems.forEach(item => {
    item.addEventListener('click', function(event) {
        navItems.forEach(item => item.classList.remove('active'));
        event.currentTarget.classList.add('active');
        fetchData(event.currentTarget.id);
    });
});

async function fetchData(id) {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${id}`);
        const cocktailData = await response.json();
        addItems(cocktailData.drinks);
    } catch (error) {
        console.log(error);
    }
}

function addItems(drinks) {
    const list = document.getElementById('list');
    list.innerHTML = '';
    drinks.forEach(drink => {
        const container = document.createElement('div');
        container.classList.add('list-item', 'col-12', 'col-sm-3');
        const title = document.createElement('h3');
        title.textContent = drink.strDrink;
        const thumbnail = document.createElement('img');
        thumbnail.src = drink.strDrinkThumb;
        thumbnail.classList.add('thumbnail');
        container.appendChild(thumbnail);
        container.appendChild(title);
        list.appendChild(container);
        container.addEventListener('click', () => showDrinkDetails(drink.idDrink));
    });
}

async function showDrinkDetails(drinkId) {
    try {
        const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`);
        const data = await response.json();
        const drink = data.drinks[0];

        document.getElementById('modal-title').textContent = drink.strDrink;
        document.getElementById('modal-description').textContent = drink.strInstructions;
        document.getElementById('modal-image').src = drink.strDrinkThumb;

        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure ? measure : ''} ${ingredient}`);
            }
        }
        document.getElementById('modal-ingredients').innerHTML = ingredients.join('<br>');

        document.getElementById('drink-modal').style.display = 'flex';
    } catch (error) {
        console.log(error);
    }
}

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('drink-modal').style.display = 'none';
});

fetchData('Cocktail');