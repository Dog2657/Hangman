from fastapi import FastAPI, HTTPException, status, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from random import randrange
from os import walk
from re import sub

cwd = "app/src/"
app = FastAPI(docs_url=None, redoc_url=None)
WordAPI = FastAPI(docs_url=None, redoc_url=None)

app.mount("/Static", StaticFiles(directory=f"{cwd}/Client/Static", html=False), name="static")
app.mount("/Stages", StaticFiles(directory=f"{cwd}/Stages", html=False), name="stages")

app.mount("/Words", WordAPI)

#  Load All Words into Memory  #
words = []
for (dirpath, dirnames, filenames) in walk(f'{cwd}/Words'):
    for filename in filenames:
        with open(f"{dirpath}/{filename}", 'r') as data:
            words.append({
                "Name": filename.rsplit('.', 1)[0].lower().title(),
                "Words": sub(' +', ' ', data.read()).split('\n')
            })

def getRandom(array):
    return array[ randrange(0, len( array ) ) ]


#   get Index.html   #
@app.get("/")
def GET_Webpage():
    with open(f"{cwd}/Client/index.html") as File:
        return HTMLResponse(File.read())


@WordAPI.get("/")
def GET_All_Words():
    return words

@WordAPI.get("/Catagorys")
def GET_All_Words():
    return [catagory.get("Name") for catagory in words]

@WordAPI.get("/Random")
def GET_Random_Word():
    RCatagory = getRandom(words).get('Words')
    return getRandom(RCatagory)

@WordAPI.get("/{CategoryName}")
def GET_Catagory_Words(CategoryName):
    data = [item for item in words if item.get("Name").lower() == CategoryName.lower()]
    if(data == []):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f'No Catagory with the name "{CategoryName}"',
        )
    Catagory_Words = data[0].get("Words")
    if(Catagory_Words == ['']):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f'No Words currently in "{CategoryName}"',
        )
    return Catagory_Words

@WordAPI.get("/{CategoryName}/Random")
def GET_Random_Catagory_Word(CategoryName):
    return getRandom( GET_Catagory_Words(CategoryName) )