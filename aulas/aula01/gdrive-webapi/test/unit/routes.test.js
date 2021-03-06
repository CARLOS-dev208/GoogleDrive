import { describe, test, expect, jest } from "@jest/globals"
import Routes from "./../../src/routes.js"

describe("#Routes test suite", () => {
    const defaultParams = {
        request: {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            method: "",
            body: {}
        },
        response: {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn()
        },
        values: () => Object.values(defaultParams)
    }

    describe("#setSocketInstance", () => {
        test("setSocket should store io instace", () => {
            const routes = new Routes()
            const ioObject = {
                to: id => ioObject,
                emit: (event, message) => {}
            }

            // routes.io tem que ser rigidamente igual a ioObject
            routes.setSocketInstance(ioObject)
            expect(routes.io).toStrictEqual(ioObject)
        }) 
    })

    describe("#handler", () => {
        

        test("given an inexistent route it should choos default route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            // alterando a key method de params
            params.request.method = "inexistent"

            // passando request e response pra chamar alguma rota
            await routes.handler(...params.values());

            // espera-se que o metodo end da response seja chamado com o "hello world"
            expect(params.response.end).toHaveBeenCalledWith("hello world")
        })
        test("it should set any request with CORS enabled", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            // alterando a key method de params
            params.request.method = "inexistent"

            // passando request e response pra chamar alguma rota
            await routes.handler(...params.values());

            // espera-se que o metodo setHeader da response seja chamado com "Access-Control-Allow-Origin", "*"
            expect(params.response.setHeader).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*")
        })
        test("given method OPTIONS it should choose options route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            // alterando a key method de params
            params.request.method = "OPTIONS"

            // passando request e response pra chamar alguma rota
            await routes.handler(...params.values());

            // espera-se que o metodo setHeader da response seja chamado com a response status 204
            expect(params.response.writeHead).toHaveBeenCalledWith(204)

            // espera-se tamb??m que o metodo end da response de params seja chamado
            expect(params.response.end).toHaveBeenCalled()
        })
        test("given method POST it should choose options route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            // alterando a key method de params
            params.request.method = "POST"
            
            // quando o routes chamar o post, eu n??o quero saber o que vai acontecer l?? dentro, 
            // s?? quero saber que chamou
            jest.spyOn(routes, routes.post.name).mockResolvedValue()

            // passando request e response pra chamar alguma rota
            await routes.handler(...params.values())
            
            // espera-se  que o m??todo post seja chamado
            expect(routes.post).toHaveBeenCalled()
        })
        test("given method GET it should choose options route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams
            }

            // alterando a key method de params
            params.request.method = "GET"

            // quando o routes chamar o get, eu n??o quero saber o que vai acontecer l?? dentro, 
            // s?? quero saber que chamou
            jest.spyOn(routes, routes.get.name).mockResolvedValue()

            // passando request e response pra chamar alguma rota
            await routes.handler(...params.values());

            // espera-se que o m??todo get seja chamado
            expect(routes.get).toHaveBeenCalled();
        })
    })

    describe("#get", () => {
        test("given method GET it should list all files downloaded", async () => {
            const routes = new Routes()
            const params = {...defaultParams}
            const filesStatusesMock = [
                {
                    size: "1.62 MB",
                    lastModified: "2021-09-06T21:01:09.004Z",
                    owner: "carlos",
                    file: "file.png"
                }
            ]

            // quando for chamado a fun????o getFilesStatus da classe routes em fileHelper
            // quero que o teste ignore o que vai acontecer com o objeto filesStatusesMock
            jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
                .mockResolvedValue(filesStatusesMock)

                params.request.method = "GET";

                // fazendo a requisi????o get passando (request,response)
                await routes.handler(...params.values());

                // espera-se que a response.writeHead de params seja chamada com o valor 200
                expect(params.response.writeHead).toHaveBeenCalledWith(200)

                // espera-se que a resposta seja retornada com a JSON do status dos arquivos
                expect(params.response.end).toHaveBeenCalledWith(JSON.stringify(filesStatusesMock))
        })
    })
})