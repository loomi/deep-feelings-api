import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Team, TeamRelations} from '../models';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {
  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource,
  ) {
    super(Team, dataSource);
  }
}
