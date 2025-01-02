
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCy1mJ_wexn7nWSQ9RW0_kemD8oS7MJjcw",
    authDomain: "datos-validador-formulario.firebaseapp.com",
    projectId: "datos-validador-formulario",
    storageBucket: "datos-validador-formulario.firebasestorage.app",
    messagingSenderId: "594851837361",
    appId: "1:594851837361:web:ace9978841f4b2e072f990",
    measurementId: "G-J4575YPJ9T"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//initialize db
const db = firebase.firestore();

document.getElementById("formulario").addEventListener("submit", (event) => {
    event.preventDefault(); // impide que el formulario se envíe con la acción por defecto del navegador

    // Expresión regular para detectar patrones de inyección SQL
    let sqlInjectionPattern = /(union|select|insert|delete|update|drop|alter|create|exec|execute|;|--|'|"|#|\*|\bOR\b|\bAND\b|\bWHERE\b|\bFROM\b|\bTABLE\b|\bDATABASE\b)/i;

    // validar campo name
    let entradaNombre = document.getElementById("name");
    let errorNombre = document.getElementById("nameError");

    // trim() elimina los espacios en blanco al principio y al final de un string
    if (entradaNombre.value.trim() === "") {
        errorNombre.textContent = "Por favor, ingrese su nombre";
        errorNombre.classList.add("error-message");
    } else if (entradaNombre.value.trim().length < 3) { // mínimo de 3 caracteres
        errorNombre.textContent = "El nombre debe tener al menos 3 caracteres";
        errorNombre.classList.add("error-message");
    } else {
        // validar que no haya inyección de código sql con regex
        let namePattern = /^[a-zA-Z\s]*$/; // patrón con expresión regular para validar nombre
        if (!entradaNombre.value.match(namePattern)) {
            errorNombre.textContent = "Por favor, ingrese un nombre válido";
            errorNombre.classList.add("error-message");
        } else if (sqlInjectionPattern.test(entradaNombre.value)) {
            errorNombre.textContent = "No se permiten caracteres especiales";
            errorNombre.classList.add("error-message");
        } else {
            errorNombre.textContent = "";
            errorNombre.classList.remove("error-message");
        }
    }

    // validar campo email
    let emailEntrada = document.getElementById("email");
    let emailError = document.getElementById("emailError");
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; // patrón con expresión regular para validar email

    if (emailEntrada.value.trim() === "") {
        emailError.textContent = "Por favor, ingrese su email";
        emailError.classList.add("error-message");
    } else if (!emailPattern.test(emailEntrada.value)) {
        emailError.textContent = "Por favor, ingrese un email válido";
        emailError.classList.add("error-message");
    } else if (sqlInjectionPattern.test(emailEntrada.value)) {
        emailError.textContent = "No se permiten caracteres especiales";
        emailError.classList.add("error-message");
    } else {
        emailError.textContent = "";
        emailError.classList.remove("error-message");
    }

    // validar campo password
    let contrasenaPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // patrón con expresión regular para validar contraseña
    let contrasenaEntrada = document.getElementById("password");
    let contrasenaError = document.getElementById("passwordError");
    if (contrasenaEntrada.value.trim() === "") {
        contrasenaError.textContent = "Por favor, ingrese su contraseña";
        contrasenaError.classList.add("error-message");
    } else if (!contrasenaPattern.test(contrasenaEntrada.value)) {
        contrasenaError.textContent = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número";
        contrasenaError.classList.add("error-message");
    } else if (sqlInjectionPattern.test(contrasenaEntrada.value)) {
        contrasenaError.textContent = "No se permiten caracteres especiales";
        contrasenaError.classList.add("error-message");
    }else {
        contrasenaError.textContent = "";
        contrasenaError.classList.remove("error-message");
    }

    // si todos los campos son válidos, enviar formulario
    if (!errorNombre.textContent && !emailError.textContent && !contrasenaError.textContent) {

        // Initialize Cloud Firestore through Firebase
        db.collection("users").add({
            nombre: entradaNombre.value,
            email: emailEntrada.value,
            password: contrasenaEntrada.value
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });


        alert("Formulario enviado correctamente");
        document.getElementById("formulario").reset(); // limpiar formulario después de enviar datos correctos
    }
});