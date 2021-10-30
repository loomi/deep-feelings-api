import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Question, QuestionRelations} from '../models';

export class QuestionRepository extends DefaultCrudRepository<
  Question,
  typeof Question.prototype.id,
  QuestionRelations
> {
  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource,
  ) {
    super(Question, dataSource);
  }
}
