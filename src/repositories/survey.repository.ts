import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DeepFeelingsDevDataSource} from '../datasources';
import {Survey, SurveyRelations, Team} from '../models';
import {TeamRepository} from './team.repository';

export class SurveyRepository extends DefaultCrudRepository<
  Survey,
  typeof Survey.prototype.id,
  SurveyRelations
> {

  public readonly team: BelongsToAccessor<Team, typeof Survey.prototype.id>;

  constructor(
    @inject('datasources.deep_feelings_dev') dataSource: DeepFeelingsDevDataSource, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>,
  ) {
    super(Survey, dataSource);
    this.team = this.createBelongsToAccessorFor('team', teamRepositoryGetter,);
    this.registerInclusionResolver('team', this.team.inclusionResolver);
  }
}
