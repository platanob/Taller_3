import pymongo
import gridfs
from PyPDF2 import PdfReader
import io

# Conexión a la base de datos MongoDB
client = pymongo.MongoClient('mongodb+srv://benja:benja@cluster0.qzervft.mongodb.net/')  # Ajusta la URL según tu configuración
db = client['APP']
collection = db['usuarios_nuevos']

# Acceder a GridFS
fs = gridfs.GridFS(db)

# Función para obtener el PDF usando el RUT
def obtener_pdf_por_rut(rut):
    # Buscar en la colección por el RUT
    documento = collection.find_one({"rut": rut})
    
    if documento and "pdf_id" in documento:
        # La ID del PDF está en el campo 'pdf_id'
        pdf_id = documento["pdf_id"]

        try:
            # Obtener el archivo PDF desde GridFS usando la ID
            archivo_pdf = fs.get(pdf_id)
            pdf_data = archivo_pdf.read()

            # Leer el PDF desde los bytes
            pdf_stream = io.BytesIO(pdf_data)
            pdf_reader = PdfReader(pdf_stream)

            # Leer el contenido del PDF (opcional)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                print(page.extract_text())
        
        except gridfs.errors.NoFile:
            print(f"No se encontró el archivo PDF con ID: {pdf_id}")
    else:
        print(f"No se encontró un archivo PDF asociado al RUT: {rut}")

# Ejemplo de uso
rut = "15.334.678-3"  # Ajusta el RUT que deseas buscar
obtener_pdf_por_rut(rut)
