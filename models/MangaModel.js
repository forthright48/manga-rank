module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: {
        $db_function: 'uuid()'
      }
    },
    name: 'text',
    author: 'text',
    tags: {
      type: 'list',
      typeDef: '<text>'
    },
    url: 'text',
    startingDate: 'date',
    completed: 'boolean',
    rank: 'double',
    rating: 'double',
    description: 'text'
  },
  key: [
    ['id'], 'rank', 'rating'
  ],
  clustering_order: {
    rank: 'asc',
    rating: 'desc'
  },
  materialized_views: {
    author_search: {
      select: ['name', 'author', 'tags', 'url', 'startingDate', 'completed', 'rank', 'rating', 'description'],
      key: [
        ['author'], 'rank', 'rating', 'id'
      ],
      clustering_order: {
        rank: 'asc',
        rating: 'desc'
      }
    },
    all_name_search: {
      select: ['name', 'author', 'tags', 'url', 'startingDate', 'completed', 'rank', 'rating', 'description'],
      key: [
        ['id'], 'name', 'rank', 'rating'
      ],
      clustering_order: {
        name: 'asc'
      }
    }
  },
  indexex: ['tags'],
  table_name: 'all_ranking_search'
};
