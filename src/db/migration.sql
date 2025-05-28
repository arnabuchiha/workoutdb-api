/**
indexing workout table
**/

ALTER TABLE workouts
ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(
    to_tsvector(
      'english',
      coalesce(array_to_string(secondary_muscles, ' '), '')
    ),
    'C'
  ) ||
  setweight(
    to_tsvector(
      'english',
      coalesce(target, '') || ' ' || coalesce(body_part, '') || ' ' || coalesce(equipment, '')
    ),
    'D'
  )
) STORED;

CREATE INDEX workouts_search_vector_idx ON workouts USING gin(search_vector);