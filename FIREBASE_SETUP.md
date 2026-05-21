# Firebase Setup para CafePotros

Sigue estos pasos para configurar Firebase Realtime Database.

## Paso 1: Crear proyecto en Firebase
1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Haz clic en "Agregar proyecto"
3. Escribe un nombre (ej: "cafepotros")
4. Desactiva Google Analytics (opcional)
5. Haz clic en "Crear proyecto"

## Paso 2: Activar Realtime Database
1. En el menu lateral, haz clic en "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona la ubicacion mas cercana (ej: us-central1)
4. Selecciona "Modo de prueba" y haz clic en "Habilitar"

## Paso 3: Obtener configuracion
1. En el menu lateral, haz clic en el engrane (Configuracion del proyecto)
2. Baja hasta "Tus apps" y haz clic en el icono de Web (</>) 
3. Escribe un nombre para la app (ej: "cafepotros-web")
4. Haz clic en "Registrar app"
5. Copia los valores de configuracion que aparecen

## Paso 4: Configurar variables de entorno
1. En la raiz del proyecto, copia `.env.local.example` a `.env.local`
2. Llena cada variable con los valores de Firebase:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = apiKey
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = authDomain
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL` = databaseURL (importante: incluye el https://)
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = projectId
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = storageBucket
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = messagingSenderId
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = appId

## Paso 5: Reiniciar la app
1. Guarda el archivo `.env.local`
2. Reinicia el servidor de desarrollo (`pnpm dev`)
3. La app ahora usara Firebase para pedidos y disponibilidad

## Estructura de la base de datos

```
cafepotros-db/
├── orders/
│   └── {orderId}/
│       ├── id
│       ├── orderNumber
│       ├── userId
│       ├── userName
│       ├── items[]
│       ├── total
│       ├── pickupTime
│       ├── createdAt
│       └── status
├── products_availability/
│   └── {productId}: boolean
└── order_counter: number
```

## Reglas de seguridad (modo prueba)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
