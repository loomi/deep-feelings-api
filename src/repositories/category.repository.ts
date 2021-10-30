import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Category, CategoryRelations, Question} from '../models';
import {QuestionRepository} from './question.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly questions: HasManyRepositoryFactory<Question, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource, @repository.getter('QuestionRepository') protected questionRepositoryGetter: Getter<QuestionRepository>,
  ) {
    super(Category, dataSource);
    this.questions = this.createHasManyRepositoryFactoryFor('questions', questionRepositoryGetter,);
    this.registerInclusionResolver('questions', this.questions.inclusionResolver);
  }
}
