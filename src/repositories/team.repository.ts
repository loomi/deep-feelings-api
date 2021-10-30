import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Team, TeamRelations, User, Survey} from '../models';
import {UserRepository} from './user.repository';
import {SurveyRepository} from './survey.repository';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {

  public readonly users: HasManyRepositoryFactory<User, typeof Team.prototype.id>;

  public readonly surveys: HasManyRepositoryFactory<Survey, typeof Team.prototype.id>;

  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('SurveyRepository') protected surveyRepositoryGetter: Getter<SurveyRepository>,
  ) {
    super(Team, dataSource);
    this.surveys = this.createHasManyRepositoryFactoryFor('surveys', surveyRepositoryGetter,);
    this.registerInclusionResolver('surveys', this.surveys.inclusionResolver);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
  }
}
