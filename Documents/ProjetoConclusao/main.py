import customtkinter
from tkinter import *
from tkcalendar import DateEntry
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime

# Conexão com o banco de dados
def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host="localhost",  # Substitua pelo seu host
            user="root",  # Substitua pelo seu usuário
            passwd="1234",  # Substitua pela sua senha
            database="Tarefas"  # Substitua pelo nome do seu banco de dados
        )
        print("Conexão com o MySQL foi bem sucedida")
    except Error as e:
        print(f"O erro '{e}' ocorreu")
    return connection

# Função para executar uma query no banco de dados
def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executada com sucesso")
    except Error as e:
        print(f"O erro '{e}' ocorreu")

# Função para buscar tarefas do banco de dados
def fetch_tasks(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"O erro '{e}' ocorreu")

# Função para salvar uma nova tarefa
def salvar():
    tarefa_titulo = entrada_titulo.get()
    tarefa_data_inicio = entrada_data.get_date()
    tarefa_descricao = descricao_texto.get("1.0", "end-1c").strip()
    
    # Determina o status baseado na data
    hoje = datetime.today().date()
    if tarefa_data_inicio == hoje:
        tarefa_status = "Em andamento"
    else:
        tarefa_status = "A fazer"

    connection = create_connection()
    query = f"INSERT INTO tarefas (titulo, descricao, status, data_inicio) VALUES ('{tarefa_titulo}', '{tarefa_descricao}', '{tarefa_status}', '{tarefa_data_inicio}')"
    execute_query(connection, query)
    atualizar_tarefas()

# Função para atualizar a lista de tarefas

checkboxes = {} 

def atualizar_tarefas():
    for widget in frameesquerda.winfo_children():
        widget.destroy()

    connection = create_connection()
    query = "SELECT * FROM tarefas"
    tarefas = fetch_tasks(connection, query)

    for tarefa in tarefas:
        tarefa_frame = customtkinter.CTkFrame(master=frameesquerda)
        tarefa_frame.pack(fill='x', pady=5)

        tarefa_check_var = customtkinter.StringVar(value="on" if tarefa[3] == "Concluído" else "off")
        tarefa_checkbutton = customtkinter.CTkCheckBox(tarefa_frame, text="", variable=tarefa_check_var, onvalue="on", offvalue="off", command=lambda tarefa_id=tarefa[0], var=tarefa_check_var, data=tarefa[4]: atualizar_status(tarefa_id, var, data))
        tarefa_checkbutton.pack(side='left', padx=5)

        # Armazena a referência do checkbox no dicionário
        checkboxes[tarefa[0]] = tarefa_checkbutton

        # Set the initial state of the checkbox
        if tarefa[3] == "Concluído":
            tarefa_checkbutton.select()
        else:
            tarefa_checkbutton.deselect()

        tarefa_label = customtkinter.CTkLabel(master=tarefa_frame, text=f"{tarefa[1]} - {tarefa[3]}", font=('Roboto', 14))
        tarefa_label.pack(side='left', padx=5)

        tarefa_label.bind("<Button-1>", lambda e, tarefa_id=tarefa[0]: abrir_janela_edicao(tarefa_id))

        remover_button = customtkinter.CTkButton(master=tarefa_frame, text="Remover", command=lambda tarefa_id=tarefa[0]: remover_tarefa(tarefa_id))
        remover_button.pack(side='right')

# Função para atualizar o status de uma tarefa
def atualizar_status(tarefa_id, var, data):
    if var.get() == "on":
        status = "Concluído"
    else:
        from datetime import date
        data_tarefa = date.fromisoformat(data)
        if data_tarefa == date.today():
            status = "Em andamento"
        else:
            status = "A fazer"

    connection = create_connection()
    query = f"UPDATE tarefas SET status = '{status}' WHERE id = {tarefa_id}"
    try:
        execute_query(connection, query)
        print("Status atualizado com sucesso")
    except Error as e:
        print(f"O erro '{e}' ocorreu ao atualizar o status")
    
    atualizar_tarefas()
    
    if status == "Concluído":
        var.set("on")
        checkboxes[tarefa_id].select()
    else:
        var.set("off")
        checkboxes[tarefa_id].deselect()
    
# Função para remover uma tarefa
def remover_tarefa(tarefa_id):
    connection = create_connection()
    query = f"DELETE FROM tarefas WHERE id = {tarefa_id}"
    execute_query(connection, query)
    atualizar_tarefas()

# Função para filtrar tarefas
def filtrar_tarefas():
    for widget in frameesquerda.winfo_children():
        widget.destroy()

    connection = create_connection()
    data_filtrada = data_filtro.get_date()
    status_filtrado = status_filtro.get()
    
    if status_filtrado == "Todos":
        select_tarefas_query = "SELECT * from tarefas"  # Não aplica filtro de data
    else:
        select_tarefas_query = f"SELECT * from tarefas WHERE data_inicio='{data_filtrada}' AND status='{status_filtrado}'"

    tarefas = fetch_tasks(connection, select_tarefas_query)

    for tarefa in tarefas:
        tarefa_frame = customtkinter.CTkFrame(master=frameesquerda)
        tarefa_frame.pack(fill='x', pady=5)

        # Uso de StringVar para o checkbox
        tarefa_check_var = customtkinter.StringVar(value="on" if tarefa[3] == "Concluído" else "off")
        tarefa_checkbutton = customtkinter.CTkCheckBox(tarefa_frame, text="", variable=tarefa_check_var, onvalue="on", offvalue="off", command=lambda tarefa_id=tarefa[0], var=tarefa_check_var, data=tarefa[4]: atualizar_status(tarefa_id, var, data))
        tarefa_checkbutton.pack(side='left', padx=5)

        # Armazena a referência do checkbox no dicionário
        checkboxes[tarefa[0]] = tarefa_checkbutton

        # Set the initial state of the checkbox based on the filtered tasks
        if tarefa[3] == "Concluído":
            tarefa_checkbutton.select()
        else:
            tarefa_checkbutton.deselect()

        tarefa_label = customtkinter.CTkLabel(master=tarefa_frame, text=f"{tarefa[1]} - {tarefa[3]}", font=('Roboto', 14))
        tarefa_label.pack(side='left', padx=5)

        tarefa_label.bind("<Button-1>", lambda e, tarefa_id=tarefa[0]: abrir_janela_edicao(tarefa_id))

        remover_button = customtkinter.CTkButton(master=tarefa_frame, text="Remover", command=lambda tarefa_id=tarefa[0]: remover_tarefa(tarefa_id))
        remover_button.pack(side='right')
        
def limpar_filtros():
    data_filtro.set_date(datetime.date.today())
    status_filtro.set("Todos")
    filtrar_tarefas()


# Função para abrir a janela de edição de uma tarefa
def abrir_janela_edicao(tarefa_id):
    connection = create_connection()
    query = f"SELECT * FROM tarefas WHERE id = {tarefa_id}"
    tarefa = fetch_tasks(connection, query)[0]

    janela_edicao = customtkinter.CTkToplevel()
    janela_edicao.title("Editar Tarefa")
    janela_edicao.geometry("400x300")

    entrada_titulo = customtkinter.CTkEntry(master=janela_edicao, placeholder_text="Título")
    entrada_titulo.insert(0, tarefa[1])
    entrada_titulo.pack(pady=5)

    entrada_data = DateEntry(master=janela_edicao, width=16, background="darkblue", foreground="white", borderwidth=2)
    entrada_data.set_date(tarefa[3])
    entrada_data.pack(pady=5)

    descricao_texto = customtkinter.CTkTextbox(master=janela_edicao, height=5, width=40)
    descricao_texto.insert('1.0', tarefa[4])
    descricao_texto.pack(pady=5)

    botao_salvar = customtkinter.CTkButton(master=janela_edicao, text="Salvar", command=lambda: salvar_edicao(tarefa_id, entrada_titulo.get(), descricao_texto.get("1.0", "end-1c"), entrada_data.get_date()))
    botao_salvar.pack(pady=5)

# Função para salvar as alterações de uma tarefa
def salvar_edicao(tarefa_id, titulo, descricao, data):
    connection = create_connection()
    hoje = datetime.today().date()
    status = "Em andamento" if data == hoje else "A fazer"
    query = f"UPDATE tarefas SET titulo = '{titulo}', descricao = '{descricao}', status = '{status}', data_inicio = '{data}' WHERE id = {tarefa_id}"
    execute_query(connection, query)
    atualizar_tarefas()

# Configuração inicial
print(os.getcwd())

customtkinter.set_appearance_mode('dark')
customtkinter.set_default_color_theme('dark-blue')

janela = customtkinter.CTk()
janela.geometry('900x1000')
janela.title('Lista de Tarefas')
janela.iconbitmap('icon.ico')
janela.resizable(False, False)

# Frame da direita para adicionar tarefa
framedireita = customtkinter.CTkFrame(master=janela, width=450, height=550)
framedireita.pack(side=RIGHT, fill=BOTH, expand=True, padx=20, pady=20)

fonte = ('Roboto', 24)
label = customtkinter.CTkLabel(master=framedireita, text='Adicione sua Tarefa', font=fonte, fg_color='transparent')
label.pack(pady=8)

# Entrada de texto para a tarefa
entrada_titulo = customtkinter.CTkEntry(master=framedireita, placeholder_text="Informe a tarefa", width=300, font=fonte)
entrada_titulo.pack(pady=14)

# Seleção de data
data_label= customtkinter.CTkLabel(master=framedireita, text="Adicione a Data:", font=('Roboto', 20), fg_color='transparent')
data_label.pack(pady=10)
entrada_data = DateEntry(master=framedireita, width=16, background="darkblue", foreground="white", borderwidth=2)
entrada_data.pack(pady=12)

# Descrição detalhada
descricao_label = customtkinter.CTkLabel(master=framedireita, text="Descrição:", font=('Roboto', 14))
descricao_label.pack(pady=10)
descricao_texto = Text(master=framedireita, height=5, width=40)
descricao_texto.pack(pady=10)

# Cria o botão
botao = customtkinter.CTkButton(master=framedireita, text="Adicionar tarefa", command=salvar)
botao.pack()

# Frame da esquerda para filtros e lista de tarefas
frameesquerda = customtkinter.CTkFrame(master=janela, width=450, height=550)
frameesquerda.pack(side=LEFT, fill=BOTH, expand=True, padx=20, pady=20)

# Filtros
filtro_label = customtkinter.CTkLabel(master=frameesquerda, text="Filtros", font=('Roboto', 16))
filtro_label.pack(pady=10)

# Filtro por data
data_filtro_label = customtkinter.CTkLabel(master=frameesquerda, text="Filtrar por Data:", font=('Roboto', 14))
data_filtro_label.pack(pady=5)
data_filtro = DateEntry(master=frameesquerda, width=16, background="darkblue", foreground="white", borderwidth=2)
data_filtro.pack(pady=5)

# Filtro por status
status_filtro_label = customtkinter.CTkLabel(master=frameesquerda, text="Filtrar por status:", font=('Roboto', 14))
status_filtro_label.pack(pady=5)
status_filtro = StringVar(value="A fazer")
todos_status_filtro = ["Concluído", "A fazer", "Em andamento", "Todos"]
menu_status_filtro = customtkinter.CTkOptionMenu(master=frameesquerda, variable=status_filtro, values=todos_status_filtro)
menu_status_filtro.pack(pady=5)

botao_filtrar = customtkinter.CTkButton(master=frameesquerda, text="Filtrar", command=filtrar_tarefas)
botao_filtrar.pack(pady=20)

# Lista de tarefas criadas
frameesquerda = customtkinter.CTkFrame(master=frameesquerda, width=400, height=400)
frameesquerda.pack(pady=10, fill=BOTH, expand=True)

# Adicione um botão para aplicar os filtros
botao_filtrar = customtkinter.CTkButton(master=frameesquerda, text="Aplicar Filtros", command=filtrar_tarefas)
botao_filtrar.pack(pady=20)

limpar_filtros_button = customtkinter.CTkButton(master=frameesquerda, text="Limpar Filtros", command=limpar_filtros)
limpar_filtros_button.pack(pady=5, side=BOTTOM)

# Chama a função para atualizar a lista de tarefas quando o programa inicia
atualizar_tarefas()

janela.mainloop()
