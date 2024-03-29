from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from random import randrange
import os


#docs_url=None
app = FastAPI(redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:5173" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


cwd = os.path.dirname(os.path.realpath(__file__))
catagorys = {}


@app.on_event("startup")
async def startup():
    path = cwd + "/words"
    for filename in os.listdir( path ):
        with open(path + "/" + filename) as file:
            words = []
    
            for line in file.readlines():
                line = line.strip().replace('\n', "")
                if(line != ""):
                    words.append(line.lower())
    
            catagorys[filename.split('.')[0].lower()] = words


def getCatagory(catagory: str):
    words = catagorys.get(catagory.lower(), None)
    if(words is None):
        raise HTTPException(404, "Catagory not found")
    
    return words





@app.get("/word-catagorys", summary="Returns a list of all catagorys")
async def GET_All_Catagorys() -> list:
    return list(catagorys.keys())

@app.get("/catagory-words/{catagory}")
async def GET_Catagory_Words(words = Depends(getCatagory)):
    return words


@app.get("/", response_class=FileResponse)
async def GET_Index():
    return f"{cwd}/client/index.html"


class fileManager(StaticFiles):
    def __init__(self) -> None:
       super().__init__(directory=f"{cwd}/client")

    async def get_response(self, request: Request, path: str) -> FileResponse:
        file_path = self.get_path(path)
        file_split = file_path.split(".", -1)

        if(file_split[1] is not None and file_split[1] == "html" ):
            raise HTTPException(404, "Not Found")

        return await super().get_response(request, path)

if(os.path.isdir(f"{cwd}/client")):
    app.mount("/", fileManager())