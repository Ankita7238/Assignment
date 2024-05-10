
const apiUrl = "https://crudcrud.com/api/e631e0a65365498ba018ea3fbe14b3b1/toffeecheck";

// Function to update a toffee's quantity in the API
async function updateToffeeQuantity(id, newQuantity, toffeename, toffeedesc, toffeeprice) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:toffeename,
                description: toffeedesc,
                price: toffeeprice,
                quantity: newQuantity })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating toffee quantity:", error);
    }
}

// Function to handle buying toffees
async function buyToffee(id, quant) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        let toffee = await response.json();
        if (toffee.quantity >= quant) {
            const newQuantity = toffee.quantity - quant;
            await updateToffeeQuantity(id, newQuantity, toffee.name, toffee.description, toffee.price);
            // Update the toffee object with the new quantity
            toffee.quantity = newQuantity;
            // Call displayToffees to refresh the list
            displayToffees();
        } else {
            alert("Not enough stock available.");
        }
    } catch (error) {
        console.error("Error buying toffee:", error);
    }
}

// Function to display toffees
async function displayToffees() {
    try {
        const toffeeList = document.getElementById("toffeeList");
        toffeeList.innerHTML = "";
        const response = await fetch(apiUrl);
        const toffees = await response.json();
        toffees.forEach(function (toffee) {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${toffee.name}</strong> - ${toffee.description}, Price: Rs.${toffee.price}, Quantity: ${toffee.quantity}
                </br>
                <button onclick="buyToffee('${toffee._id}', 1)">Buy One</button>
                <button onclick="buyToffee('${toffee._id}', 2)">Buy Two</button>
                <button onclick="buyToffee('${toffee._id}', 3)">Buy Three</button>
            `;
            toffeeList.appendChild(li);
        });
    } catch (error) {
        console.error("Error displaying toffees:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const toffeeForm = document.getElementById("toffeeForm");

    // Event listener for form submission
    toffeeForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const toffeeName = document.getElementById("toffeeName").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const quantity = document.getElementById("quantity").value;

        const toffee = {
            name: toffeeName,
            description: description,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        };

        await addToffee(toffee);
        // After adding a new toffee, refresh the list
        displayToffees();
        toffeeForm.reset();
    });

    // Function to add a new toffee to the API
    async function addToffee(toffee) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(toffee)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error adding toffee:", error);
        }
    }

    // Initial display of toffees
    displayToffees();
});
