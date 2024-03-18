//api
const api = "http://localhost:3000/events";

const addButton = document.querySelector(".add_btn");
const eventLists = document.querySelector('.event_lists');
const tableBody = document.querySelector(".event_lists tbody");

let eventIndex = 1;

//async function to receive data from the server
async function fetchEvents(){
    try{
        //use fetch to call the server
        const response = await fetch(api);
        if(!response.ok){
            throw new Error("Fetch failed");
        }

        const data = await response.json();
        console.log(data);
        console.log(Object.keys(data[0]));

        tableBody.innerHTML = "";

        //add events in page
        data.forEach((value, index) => {
            // Create a new row for each item
           const row = document.createElement("tr");
            row.innerHTML=`
            <td>${value.eventName}</td>
            <td>${value.startDate}</td>
            <td>${value.endDate}</td>
            <td>
            <button class="editBtn" id="${value.id}">
            <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
            Edit
          </button>
              <button class="deleteBtn" id=${value.id}>
              <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
              Delete</button>
            </td>
            `;
            tableBody.appendChild(row);
        
        }); 
    }catch(err){
        console.error(err.message);
    }
}


//show data 
fetchEvents();


//event add function
async function addEvent(eventName, startDate, endDate){
   try{
        //use fetch to call the server 
        await fetch(
            api, 
            {method: "POST", headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({eventName: eventName, startDate:startDate, endDate:endDate})
        });
        fetchEvents();
   }catch(err){
    console.error(err.message);
   }
}


//event delete function
async function deleteEvent(id){
    try{
        await fetch(`${api}/${id}`, {method: 'DELETE'});
        fetchEvents();
    }catch(err){
        console.error(err.message);
    }
}


//event modified function
async function modifyEvent(id, eventName, startDate, endDate){
    try {
        const response = await fetch(`${api}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventName: eventName, startDate: startDate, endDate: endDate })
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        console.log('updated successfully');
        fetchEvents();
    } catch (err) {
        console.error(err.message);
    }
}

//add button clicked
addButton.addEventListener('click', function(e){
    e.preventDefault();
    //if button clicked, create an new row at the end
    const row = document.createElement("tr");
    row.innerHTML =`
        <td><input class="eventInput" type="text" /></td>
        <td><input class="startDate" type="date"/></td>
        <td><input class="endDate" type="date" /></td>
        <td>
        <button class="addBtn">
        <svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Add
        </button>
        <button class="cancelBtn">
        <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
        Cancel
        </button>
        </td>
    `;
    tableBody.appendChild(row);
 
    //after the add confirm btn clicked, it will call the addevent function
    const addBtn = document.querySelector('.addBtn');
    addBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const eventNameInput = row.querySelector('.eventInput');
        const startDateInput = row.querySelector('.startDate');
        const endDateInput = row.querySelector('.endDate');
        const eventName = eventNameInput.value.trim();
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        
        if (eventName && startDate && endDate) {
            await addEvent(eventName, startDate, endDate);
        } else {
            alert('Please fill in all fields.');
        }
    })

    //if the cancel button is clicked, remove the event
    const cancelBtn = row.querySelector('.cancelBtn');
    cancelBtn.addEventListener('click', function() {
        tableBody.removeChild(row); // Remove the row if "Cancel" is clicked
    });

});

//listen if the delete button is clicked
eventLists.addEventListener('click', (e)=>{
    if(e.target.classList.contains('deleteBtn')){
        e.preventDefault();
        const id = e.target.id;
        console.log(id);
        deleteEvent(id);
        
    }
})


// Listen if the modify button is clicked
eventLists.addEventListener('click', (e) => {
    if (e.target.classList.contains('editBtn')) {
        e.preventDefault();
        const id = e.target.id;
        console.log(id);
    
        const row = e.target.parentElement.parentElement;
        console.log(row);
        // Retrieve the current values
        const eventName = row.querySelector('td:nth-child(1)').textContent;
        const startDate = row.querySelector('td:nth-child(2)').textContent;
        const endDate = row.querySelector('td:nth-child(3)').textContent;

        // Replace the text content with input fields
        row.innerHTML = `
            <td><input class="eventName" type="text" value="${eventName}" /></td>
            <td><input class="startDate" type="date" value="${startDate}" /></td>
            <td><input class="endDate" type="date" value="${endDate}" /></td>
            <td>
                <button class="saveBtn"><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>Save</button>
                <button class="cancelBtn"><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>Cancel</button>
            </td>
        `;

        // Listen for click on Save button
        const saveBtn = row.querySelector('.saveBtn');
        saveBtn.addEventListener('click', async () => {
            const updatedEventName = row.querySelector('.eventName').value.trim();
            const updatedStartDate = row.querySelector('.startDate').value;
            const updatedEndDate = row.querySelector('.endDate').value;

            if (updatedEventName && updatedStartDate && updatedEndDate) {
                await modifyEvent(id, updatedEventName, updatedStartDate, updatedEndDate);
            } else {
                alert('Please fill in all fields.');
            }
        });

        // Listen for click on Cancel button
        const cancelBtn = row.querySelector('.cancelBtn');
        cancelBtn.addEventListener('click', () => {
            // Restore original values
            row.innerHTML = `
                <td>${eventName}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>
                    <button class="editBtn" id="${id}">Edit</button>
                    <button class="deleteBtn" id="${id}">Delete</button>
                </td>
            `;
        });
    }
});