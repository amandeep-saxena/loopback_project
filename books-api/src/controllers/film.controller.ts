// import { post, requestBody, response, get, HttpErrors, param } from "@loopback/rest";
import { repository } from "@loopback/repository";
import { BookRepository, FilmRepository } from "../repositories";
import expressFileUpload from 'express-fileupload';
// import { error, timeStamp } from "console";
import multer from 'multer';

// import { MessageChannel } from "worker_threads";
import fs from 'fs';
import {
  get,
  post,
  requestBody,
  response,
  HttpErrors,
  RestBindings,
  param,

} from '@loopback/rest';
import { inject } from '@loopback/core';
// import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';


import { Book } from "../models";
// import { Film } from "../models";
// import { file } from "path-type";


// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb: any) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb: any) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// multer({ storage: multerStorage }).any();


export class FilmController {
  constructor(
    @repository(FilmRepository)
    public filmRepository: FilmRepository,
    @repository(BookRepository)
    public bookRepository: BookRepository

  ) { }



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




  //   @post('/film')
  //   @response(200)

  //   async create(@requestBody({}) film: any): Promise < object > {

  //     if(!film.title || !film.description || !film.category || !film.rating || !film.actors) {
  //     throw new HttpErrors.BadRequest('Missing required fields');
  //   }

  //   const createdFilm = await this.filmRepository.create(film);

  //   return {
  //     message: 'Film successfully created',
  //     film: createdFilm,
  //   };
  // }



  @post('/film')
  @response(200)
  async createData(@requestBody({}) film: any): Promise<object> {

    if (!film.title || !film.description || !film.category || !film.rating || !film.actors) {
      throw new HttpErrors.BadRequest('Missing required fields');
    }

    let createdFilm = await this.filmRepository.create(film)

    return {
      message: 'Film successfully created',
      film: createdFilm,
    };

  }




  @post('/upload')
  @response(200, {
    description: 'File uploaded successfully',
    content: { 'multipart/form-data': { schema: { type: 'object' } } },
  })
  async create(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response
  ): Promise<object> {

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    });


    const upload = multer({ storage }).single('file');

    return new Promise((resolve, reject) => {
      upload(req, res, async (err) => {
        if (err) {
          reject(new HttpErrors.InternalServerError(`File upload failed: ${err.message}`));
        }


        const uploadedFile = req.file;
        if (!uploadedFile) {
          reject(new HttpErrors.BadRequest('No file uploaded'));
        }

        const { title, description, category, rating, actors } = req.body;

        const createdFilm = {
          title,
          description,
          category,
          rating,
          actors,
          file: uploadedFile?.path,
        };

        try {

          const savedFilm = await this.filmRepository.create(createdFilm);

          console.log('Created film:', savedFilm);

          resolve({
            message: 'Film successfully created',
            film: savedFilm,
          });
        } catch (error) {
          reject(new HttpErrors.InternalServerError('Failed to save film to database'));
        }
      });
    });
  }








  @get('/film/{id}')
  @response(200)
  async findById(@param.path.string('id') id: string): Promise<Film> {

    if (!id) {
      throw new HttpErrors.BadRequest('The "id" parameter is required.');
    }

    try {

      let data = await this.filmRepository.findById(id);
      console.log(data)
      return data

    } catch (error) {
      if (error.code === 'ENTITY_NOT_FOUND') {
        throw new HttpErrors.NotFound(`Film with id ${id} not found.`);
      }
      throw error;

    }
  }


  // @post('film/{id}')
  // @response(200)
  // async replaceById(@param.path.string('id') id: string, @requestBody({}) film: Film): Promise<any> {



  //   let updateData = await this.filmRepository.replaceById(id, film)
  //   return {
  //     Message: "update record ",
  //     data: updateData

  //   }
  // }


  @get('/bookess')
  @response(200, {})
  async find(
  ): Promise<Book[]> {
    return this.bookRepository.find();
  }







}
