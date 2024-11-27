// Uncomment these imports to begin using these cool features!

import { post, requestBody, response, get, HttpErrors, param } from "@loopback/rest";
import { Film } from "../models";
import { repository } from "@loopback/repository";
import { BookRepository, FilmRepository } from "../repositories";
import { error, timeStamp } from "console";
import { MessageChannel } from "worker_threads";

import { Book } from "../models";


export class FilmController {
  constructor(
    @repository(FilmRepository)
    public filmRepository: FilmRepository,
    @repository(BookRepository)
    public bookRepository: BookRepository

  ) { }


  // @post('/film')
  // @response(200)

  // // async create(@requestBody({}) film: any): Promise<object> {

  // //   if (!film.title || !film.description || !film.category || !film.rating || !film.actors) {
  // //     throw new HttpErrors.BadRequest('Missing required fields');
  // //   }

  // //   const createdFilm = await this.filmRepository.create(film);

  // //   return {
  // //     message: 'Film successfully created',
  // //     film: createdFilm,
  // //   };
  // // }


  
  @post('/film')
  @response(200)
  async create(@requestBody({}) film: any): Promise<object> {

    if (!film.title || !film.description || !film.category || !film.rating || !film.actors) {
      throw new HttpErrors.BadRequest('Missing required fields');
    }

    let createdFilm = await this.filmRepository.create(film)

    return {
      message: 'Film successfully created',
      film: createdFilm,
    };

  }

  @get('/film')
  @response(200)
  async findAllfilm() {

    let film = await this.filmRepository.find()
    console.log(film)

    return {
      message: "all data",
      data: film
    }

  }

  @get('/film/{id}')
  @response(200)
  async findById(@param.path.string('id') id: string): Promise<Film> {

    try {
      let data = await this.filmRepository.findById(id);
      console.log(data)
      return data

    } catch (error) {
      throw new HttpErrors.NotFound(`film with Id ${id} not found`)

    }
  }


  @post('film/{id}')
  @response(200)
  async replaceById(@param.path.string('id') id: string, @requestBody({}) film: Film): Promise<any> {

    let updateData = await this.filmRepository.replaceById(id, film)
    return {
      Message: "update record ",
      data: updateData

    }
  }


  @get('/bookess')
  @response(200, {})
  async find(
  ): Promise<Book[]> {
    return this.bookRepository.find();
  }




}
