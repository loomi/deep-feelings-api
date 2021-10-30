import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Question, QuestionRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class QuestionRepository extends DefaultCrudRepository<
  Question,
  typeof Question.prototype.id,
  QuestionRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Question.prototype.id>;

  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Question, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
