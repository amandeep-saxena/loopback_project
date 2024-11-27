import { Entity, model, property } from '@loopback/repository';

@model()
export class Film extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'number',
    required: true,
  })
  length: number;

  @property({
    type: 'string',
    required: true,
  })
  rating: string;

  @property({
    type: 'string',
    required: true,
  })
  actors: string;


  constructor(data?: Partial<Film>) {
    super(data);
  }
}

export interface FilmRelations {
  // describe navigational properties here
}

interface FilmResponse {
  response: string;
  data: Film;
}

export type FilmWithRelations = Film & FilmRelations;
