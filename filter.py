import os
import pandas as pd
flags_csv = os.path.join(os.path.dirname(__file__), "flags.csv")
flags_df = pd.read_csv(flags_csv)
import csv

#filtrar flags, 1 e 2 de cada usuário

for flag in flags_df.itertuples():
    if flag.numero in [1, 2]:
        #salvar só essas linhas em um novo csv
        with open("filtered_flags.csv", "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([flag.id, flag.user_id, flag.numero, flag.value])
