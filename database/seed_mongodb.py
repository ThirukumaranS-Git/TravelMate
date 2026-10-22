import json, os
from pymongo import MongoClient
uri=os.getenv('MONGODB_URI','mongodb://127.0.0.1:27017')
db_name=os.getenv('MONGODB_DB_NAME','travelmate')
with open(os.path.join(os.path.dirname(__file__),'mongodb_seed.json'),encoding='utf-8') as f:
    data=json.load(f)
client=MongoClient(uri, serverSelectionTimeoutMS=3000)
client.admin.command('ping')
col=client[db_name]['destination_metadata']
for doc in data:
    col.replace_one({'destination':doc['destination']},doc,upsert=True)
print(f'Seeded {len(data)} MongoDB documents into {db_name}.destination_metadata')
