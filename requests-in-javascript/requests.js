const axios = require('axios');

const url = "http://localhost:5000/constellations";
const idToSearch = 'UEUrlfX';

const invincible = {
    name: 'Invincible',
    meaning: 'Indestructible',
    startsWithPlanets: 100,
    quadrant: 'JM3'
}

const eridanus = {
    name: "Eridanus",
    meaning: "River",
    starsWithPlanets: 26,
    quadrant: "NQ2"
}

axios.get(url).then(response => response.data.forEach(constellation => console.log(constellation.name)));


// find by id
async function findConstellationById(id) {
    const { name, meaning } = await axios.get(url)
        .then(response => response.data.find(constellation => constellation.id === idToSearch));

    return `Name: ${name}  Meaning: ${meaning}`;
}

// add constellation using post req
async function addConstellation(constellation) {
    return axios.post(url, constellation);
}

// delete function by id
async function deleteConstellation(id) {
    return axios.delete(`${url}/${id}`);
}

// check for duplicates and return name of duplicate constellation
async function checkForDupes() {
    const constellations = await axios.get(url).then(({ data }) => data);
    const names = constellations.map(constellation => constellation.name);
    let dupes = false;
    let dupeName = undefined;

    names.forEach(name => {
        if (names.filter(n => n === name).length > 1) {
            dupes = true;
            dupeName = name;
        }
    });

    if (dupeName === undefined) return Promise.reject(`No duplicates found.`);
    return constellations.find(constellation => constellation.name === dupeName);
}

// delete any duplicates in the server
async function deleteDuplicates() {
    try {
        const { id, name } = await checkForDupes();

        console.log(`Deleting: ${name} with id: ${id}`);

        axios.delete(`${url}/${id}`);
        deleteDuplicates();
    } catch (err) {
        console.error(err);
    }
}

deleteDuplicates();