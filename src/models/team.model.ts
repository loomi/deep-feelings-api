import {Entity, model, property, hasMany} from '@loopback/repository';
import {User} from './user.model';
import {Survey} from './survey.model';

@model()
export class Team extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuid',
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @hasMany(() => User)
  users: User[];

  @hasMany(() => Survey)
  surveys: Survey[];

  constructor(data?: Partial<Team>) {
    super(data);
  }
}

export interface TeamRelations {
  // describe navigational properties here
}

export type TeamWithRelations = Team & TeamRelations;
