import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Survey, SurveyRelations} from '../models';

export class SurveyRepository extends DefaultCrudRepository<
  Survey,
  typeof Survey.prototype.id,
  SurveyRelations
> {
  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource,
  ) {
    super(Survey, dataSource);
  }
}
