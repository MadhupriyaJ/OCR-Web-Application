# # TRADE_FINANCE/Backend/pdf/routes.py
# from fastapi import APIRouter, HTTPException
# import pyodbc

# router = APIRouter()

# # SQL Server connection string
# conn_str = (
#     "DRIVER={SQL Server};"
#     "SERVER=MadhupriyajWS;"
#     "DATABASE=TradeFinance;"
#     "UID=priyaJ;"
#     "PWD=1234"
# )

# def get_all_tables():
#     with pyodbc.connect(conn_str) as conn:
#         cursor = conn.cursor()
#         cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        
#         return [row[0] for row in cursor.fetchall()]

# @router.get("/pdf-names")
# def get_pdf_names():
#     pdf_titles = set()
#     tables = get_all_tables()
#     print("Fetching PDF names from tables:", tables)

#     with pyodbc.connect(conn_str) as conn:
#         cursor = conn.cursor()
#         for table in tables:
#             try:
#                 cursor.execute(f"SELECT pdf_title FROM [{table}]")
#                 rows = cursor.fetchall()
#                 for row in rows:
#                     if row[0]:
#                         pdf_titles.add(row[0])
#             except Exception:
#                 continue  # Table doesn't have pdf_title or other issue

#     return {"pdfNames": sorted(pdf_titles)}

# @router.get("/pdf-data/{pdf_title}")
# def get_pdf_data(pdf_title: str):
#     tables = get_all_tables()

#     with pyodbc.connect(conn_str) as conn:
#         cursor = conn.cursor()
#         for table in tables:
#             try:
#                 cursor.execute(f"SELECT * FROM [{table}] WHERE pdf_title = ?", (pdf_title,))
#                 columns = [column[0] for column in cursor.description]
#                 rows = cursor.fetchall()
#                 if rows:
#                     return {
#                         "table": table,
#                         "articles": [dict(zip(columns, row)) for row in rows]
#                     }
#             except Exception:
#                 continue  # Skip if query fails

#     raise HTTPException(status_code=404, detail="PDF data not found")
# TRADE_FINANCE/Backend/pdf/routes.py
from fastapi import APIRouter, HTTPException
import pyodbc

router = APIRouter()

# SQL Server connection string
conn_str = (
    "DRIVER={SQL Server};"
    "SERVER=MadhupriyajWS;"
    "DATABASE=TradeFinance;"
    "UID=priyaJ;"
    "PWD=1234"
)

def get_all_tables():
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
        return [row[0] for row in cursor.fetchall()]

def get_column_names(table):
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = ?
        """, (table,))
        return [row[0] for row in cursor.fetchall()]

@router.get("/pdf-names")
def get_pdf_names():
    pdf_titles = set()
    tables = get_all_tables()

    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        for table in tables:
            columns = get_column_names(table)
            column = None

            if 'pdf_title' in columns:
                column = 'pdf_title'
            elif 'pdf_name' in columns:
                column = 'pdf_name'

            if column:
                try:
                    cursor.execute(f"SELECT {column} FROM [{table}]")
                    rows = cursor.fetchall()
                    for row in rows:
                        if row[0]:
                            pdf_titles.add(row[0])
                except Exception:
                    continue

    return {"pdfNames": sorted(pdf_titles)}

@router.get("/pdf-data/{pdf_title}")
def get_pdf_data(pdf_title: str):
    tables = get_all_tables()

    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        for table in tables:
            columns = get_column_names(table)

            column = None
            if 'pdf_title' in columns:
                column = 'pdf_title'
            elif 'pdf_name' in columns:
                column = 'pdf_name'

            if column:
                try:
                    cursor.execute(f"SELECT * FROM [{table}] WHERE {column} = ?", (pdf_title,))
                    rows = cursor.fetchall()
                    if rows:
                        column_names = [col[0] for col in cursor.description]
                        return {
                            "table": table,
                            "articles": [dict(zip(column_names, row)) for row in rows]
                        }
                except Exception:
                    continue

    raise HTTPException(status_code=404, detail="PDF data not found")
