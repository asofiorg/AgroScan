import { useRouter } from "next/router";

const es = {
  locale: "es",
  changeLocale: "In English",
  hero: {
    title: "Toma una fotografia  y detecta las enfermedades de tu cultivo",
    subtitle:
      "Inteligencia artifical que da resultados en segundos para detectar la salud de tus plantas",
    cta: "Pruebalo ahora",
  },
  about: {
    title: "Sobre nosotros",
    content:
      "AgroScan es una aplicación gratuita que te permite tomar una foto de tu cultivo de cacao y detectar enfermedades y plagas utilizando inteligencia artificial y aprendizaje automático, proporcionando un informe detallado en tiempo real. Con AgroScan, puedes identificar enfermedades comunes del cacao y reportar tus resultados a la comunidad de AgroScan para ayudar a controlar la propagación de enfermedades en el país.",
  },
  asofi: {
    title: "Sobre ASOFI",
    content:
      "La Asociación Femenina de Innovación para el Desarrollo Rural (ASOFI) es una plataforma de colaboración enfocada en el activismo social y la igualdad de género en STEM. Su misión es conectar, empoderar y apoyar el talento femenino en estas áreas para contribuir a la construcción de la paz y el desarrollo rural en Colombia, un país que ha enfrentado diferentes formas de violencia a lo largo de su historia. ASOFI promueve la participación femenina en STEM, ofreciendo herramientas educativas sociales y tecnológicas (a través de bootcamps y eventos presenciales en colegios de niñas) para formar a la próxima generación de mujeres agentes de cambio en estas áreas.",
  },
  cta: {
    title: "Pruebalo ahora",
    subtitle: "Toma una foto de tu cultivo y detecta enfermedades",
    button: "Inicia ahora",
  },
  scan: {
    title: "Escanea tu cultivo",
    subtitle: "Toma una foto de tu cultivo y detecta enfermedades",
  },
  predict: {
    capture: "Tomar foto",
    upload: "Subir foto",
    cameraWarning:
      "Por favor, asegúrate de que tu cámara esté encendida y que tengas acceso a ella",
  },
  staging: {
    title: "Procesaremos tu foto",
    subtitle: "Pulsa el boton para procesar",
    button: "Procesar",
    back: "Escoger otra foto",
    loading: "Procesando...",
  },
  result: {
    title: "Resultados",
    subtitle: "Hemos analizado tu foto y estos son los resultados",
    Healthy: "Tu cultivo esta sano",
    Unhealthy: "Tu cultivo esta enfermo",
    report: "Reportar tus resultados",
    again: "Procesar otra foto",
  },
  report: {
    noData: {
      title: "Parece que no has procesado ninguna foto",
      scan: "Escanea tu cultivo",
    },
    data: {
      title: "Sube tu reporte",
      subtitle: "Con tu ayuda podemos controlar la propagación de enfermedades",
      Healthy: "Tu cultivo esta sano",
      Unhealthy: "Tu cultivo esta enfermo",
      fill: "Por favor, completa todos los campos",
      privacy: "No compartiremos tus datos con nadie",
    },
  },
  form: {
    address: {
      label: "Ingresa tu dirección",
      placeholder: "Dirección",
    },
    contact: {
      label: "Ingresa tu número de contacto",
      placeholder: "Número de contacto",
    },
    comments: {
      label: "Ingresa tus comentarios",
      placeholder: "Comentarios",
    },
    submit: "Enviar",
    again: "Reportar otra foto",
    loading: "Enviando...",
  },
  submitted: {
    title: "Gracias por tu reporte",
    subtitle: "Con tu ayuda podemos controlar la propagación de enfermedades",
    again: "Reportar otra foto",
  },
  admin: {
    password: {
      label: "Ingresa la contraseña",
      placeholder: "Contraseña",
      submit: "Ingresar",
      incorrect: "Contraseña incorrecta",
    },
    loading: "Cargando...",
    pagination: {
      previous: "Anterior",
      next: "Siguiente",
    },
    reports: {
      title: "Reportes",
      address: "Dirección",
      contact: "Contacto",
      comments: "Comentarios",
      status: "Estado",
      date: "Fecha",
      report: {
        Healthy: "Sano",
        Unhealthy: "Enfermo",
      },
    },
  },
};

const en = {
  locale: "en",
  changeLocale: "En Español",
  hero: {
    title: "Take a picture and detect the diseases of your crop",
    subtitle:
      "Artificial intelligence that gives results in seconds to detect the health of your plants",
    cta: "Try it now",
  },
  about: {
    title: "About us",
    content:
      "AgroScan is a free app that allows you to take a photo of your cocoa crop and detect diseases and pests using artificial intelligence and machine learning, providing a detailed report in real time. With AgroScan, you can identify common cocoa diseases and report your results to the AgroScan community to help control the spread of diseases in the country.",
  },
  asofi: {
    title: "About ASOFI",
    content:
      "The Women's Association for Innovation for Rural Development (ASOFI) is a collaboration platform focused on social activism and gender equality in STEM. Its mission is to connect, empower and support female talent in these areas to contribute to the building of peace and rural development in Colombia, a country that has faced different forms of violence throughout its history. ASOFI promotes female participation in STEM, providing social and technological educational tools (through bootcamps and on-site events in girls' schools) to train the next generation of women agents of change in these areas.",
  },
  cta: {
    title: "Try it now",
    subtitle: "Take a picture and detect the diseases of your crop",
    button: "Start now",
  },
  scan: {
    title: "Scan your crop",
    subtitle: "Take a picture and detect the diseases of your crop",
  },
  predict: {
    capture: "Take a picture",
    upload: "Upload a picture",
    cameraWarning:
      "Please make sure your camera is turned on and you have access to it",
  },
  staging: {
    title: "We will process your photo",
    subtitle: "Press the button to process",
    button: "Process",
    back: "Choose another photo",
    loading: "Processing...",
  },
  result: {
    title: "Results",
    subtitle: "We have analyzed your photo and these are the results",
    Healthy: "Your crop is healthy",
    Unhealthy: "Your crop is unhealthy",
    report: "Report your results",
    again: "Scan another crop",
  },
  report: {
    noData: {
      title: "Looks like you don't have any predictions yet",
      scan: "Scan your crop",
    },
    data: {
      title: "Upload your report",
      subtitle: "With your help we can control the spread of diseases",
      Healthy: "Your crop is healthy",
      Unhealthy: "Your crop is unhealthy",
      fill: "Please fill all the fields",
      privacy: "We will not share your data with anyone",
    },
  },
  form: {
    address: {
      label: "Enter your address",
      placeholder: "Address",
    },
    contact: {
      label: "Enter your contact number",
      placeholder: "Contact number",
    },
    comments: {
      label: "Enter your comments",
      placeholder: "Comments",
    },
    submit: "Submit",
    again: "Report another photo",
    loading: "Loading...",
  },
  submitted: {
    title: "Thank you for your report",
    subtitle: "With your help we can control the spread of diseases",
    again: "Report another photo",
  },
  admin: {
    password: {
      label: "Enter the password",
      placeholder: "Password",
      submit: "Enter",
      incorrect: "Incorrect password",
    },
    loading: "Loading...",
    pagination: {
      previous: "Previous",
      next: "Next",
    },
    reports: {
      title: "Reports",
      address: "Address",
      contact: "Contact",
      comments: "Comments",
      status: "Status",
      date: "Date",
      report: {
        Healthy: "Healthy",
        Unhealthy: "Unhealthy",
      },
    },
  },
};

const useTranslation = () => {
  const router = useRouter();

  const { locale } = router;

  return locale === "en" ? en : es;
};

export default useTranslation;
