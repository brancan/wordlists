import random
from colorama import Fore, Style

def cargar_palabras(archivo):
    try:
        with open(archivo, 'r') as f:
            palabras = [line.strip() for line in f]
        return palabras
    except FileNotFoundError:
        print(Fore.RED + "¡El archivo de palabras no se encontró!" + Style.RESET_ALL)
        return []

def imprimir_todas_palabras(palabras):
    imprimir = input("¿Deseas imprimir todas las palabras? (s/n): ")
    if imprimir.lower() == 's':
        print("Todas las palabras cargadas:")
        for palabra in palabras:
            print(Fore.GREEN + palabra + Style.RESET_ALL)

def eliminar_palabras_largas(palabras, longitud_maxima):
    return [palabra for palabra in palabras if len(palabra) <= longitud_maxima]

def eliminar_palabras_con_letras(palabras, letras):
    return [palabra for palabra in palabras if not any(letra in palabra for letra in letras)]

def conservar_palabras_con_letras(palabras, letras):
    return [palabra for palabra in palabras if all(letra in palabra for letra in letras)]

def sugerencia_palabras(palabras, max_palabras=10):
    sugerencias = random.sample(palabras, min(len(palabras), max_palabras))
    print("Sugerencias:", end=" ")
    print(Fore.BLUE + " ".join(sugerencias) + Style.RESET_ALL)

def filtrar_palabras_con_muestra(palabras, muestra):
    if '_' not in muestra:
        return palabras
    else:
        return [palabra for palabra in palabras if len(palabra) == len(muestra) and all(letra == '_' or palabra[i] == letra for i, letra in enumerate(muestra))]

def eliminar_palabras_con_letras_en_lugares(palabras, letras, posiciones):
    return [palabra for palabra in palabras if all((pos >= len(palabra)) or (palabra[pos] != letra) for pos, letra in zip(map(int, posiciones.split()), letras))]

def main():
    archivo = "english.txt"
    palabras = cargar_palabras(archivo)

    print("Cantidad total de palabras:", len(palabras))
    
    try:
        longitud_maxima = int(input("Cantidad máxima de letras: "))
        palabras = eliminar_palabras_largas(palabras, longitud_maxima)
        print("Quedan", len(palabras), "palabras.")
    except ValueError:
        print("¡ingresa un número entero válido!")

    while True:

        letras_a_eliminar = input("Letras que NO van separadas por espacios: ").split()
        palabras = eliminar_palabras_con_letras(palabras, letras_a_eliminar)
        print("Quedan", len(palabras), "palabras.")
        sugerencia_palabras(palabras)

        letras_a_conservar = input("Letras que van separadas por espacios: ").split()
        palabras = conservar_palabras_con_letras(palabras, letras_a_conservar)
        print("Quedan", len(palabras), "palabras.")
        sugerencia_palabras(palabras)

        muestra = input("Letras en su lugar (usando '_' para letras desconocidas): ")
        palabras = filtrar_palabras_con_muestra(palabras, muestra)
        print("Quedan", len(palabras), "palabras.")
        sugerencia_palabras(palabras)

        letras_a_eliminar_en_lugares = input("Letras que NO pueden estar en lugares específicos, separadas por espacios: ").split()
        posiciones = input("Posiciones de las letras, separadas por espacios recuerda que la primera es 0 : ")
        palabras = eliminar_palabras_con_letras_en_lugares(palabras, letras_a_eliminar_en_lugares, posiciones)
        print("Quedan", len(palabras), "palabras.")
        sugerencia_palabras(palabras)

        imprimir_todas_palabras(palabras)

if __name__ == "__main__":
    main()
