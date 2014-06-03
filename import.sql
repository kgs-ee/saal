INSERT INTO entity (entity_definition_keyname, old_id, created, created_by)
SELECT 'banner', concat('banner-',id), now(), 'import'
FROM saal_banners;

INSERT INTO property (property_definition_keyname, entity_id, value_display, value_string, created, created_by)
SELECT 'banner-url', (SELECT id FROM entity WHERE old_id = concat('banner-',saal_banners.id)) entity_id, link, link, now(), 'import'
FROM saal_banners;


INSERT INTO entity (entity_definition_keyname, old_id, sharing, created, created_by)
VALUES ('category', concat('category-1'), 'public', now(), 'import')
     , ('category', concat('category-2'), 'public', now(), 'import')
     , ('category', concat('category-3'), 'public', now(), 'import')
     , ('category', concat('category-4'), 'public', now(), 'import')
     , ('category', concat('category-5'), 'public', now(), 'import')
     , ('category', concat('category-6'), 'public', now(), 'import')
     , ('category', concat('category-7'), 'public', now(), 'import')
     , ('category', concat('category-8'), 'public', now(), 'import')
     , ('category', concat('category-9'), 'public', now(), 'import')
;

INSERT INTO property (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_string`, `created`, `created_by`)
VALUES
('category-name', (SELECT id FROM entity WHERE old_id = 'category-1'), 'estonian', 'Tants', 'Tants', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-2'), 'estonian', 'Teater', 'Teater', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-3'), 'estonian', 'Performance', 'Performance', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-4'), 'estonian', 'Muusika', 'Muusika', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-5'), 'estonian', 'Tsirkus', 'Tsirkus', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-6'), 'estonian', 'Loeng', 'Loeng', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-7'), 'estonian', 'Film', 'Film', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-8'), 'estonian', 'Video', 'Video', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-9'), 'estonian', 'Diskussioon', 'Diskussioon', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-1'), 'english', 'Dance', 'Dance', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-2'), 'english', 'Theatre', 'Theatre', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-3'), 'english', 'Performance', 'Performance', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-4'), 'english', 'Music', 'Music', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-5'), 'english', 'Circus', 'Circus', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-6'), 'english', 'Lecture', 'Lecture', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-7'), 'english', 'Film', 'Film', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-8'), 'english', 'Video', 'Video', now(), 'import') ,
('category-name', (SELECT id FROM entity WHERE old_id = 'category-9'), 'english', 'Discussion', 'Discussion', now(), 'import')
;

--
-- Events
INSERT INTO entity (entity_definition_keyname, old_id, sharing, created, created_by)
SELECT 'event', concat('event-',id), 'public' now(), 'import'
 FROM saal_events;

--
-- Event properties
DELETE FROM property WHERE property_definition_keyname = 'event-name';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_string`, `created`, `created_by`)
SELECT 'event-name', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , 'estonian', s_e.title2, s_e.title2, now(), 'import'
 FROM saal_events_et s_e
 HAVING entity_id IS NOT NULL;

INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_string`, `created`, `created_by`)
SELECT 'event-name', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , 'english', s_e.title2, s_e.title2, now(), 'import'
 FROM saal_events_en s_e
 HAVING entity_id IS NOT NULL;

DELETE FROM property WHERE property_definition_keyname = 'event-price';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_string`, `created`, `created_by`)
SELECT 'event-price', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.price, s_e.price, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL;

DELETE FROM property WHERE property_definition_keyname = 'event-description';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_text`, `created`, `created_by`)
SELECT 'event-description', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , 'estonian', s_e.body, s_e.body, now(), 'import'
 FROM saal_events_et s_e
 HAVING entity_id IS NOT NULL AND s_e.body != '';

INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_display`, `value_text`, `created`, `created_by`)
SELECT 'event-description', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , 'english', s_e.body, s_e.body, now(), 'import'
 FROM saal_events_en s_e
 HAVING entity_id IS NOT NULL AND s_e.body != '';

DELETE FROM property WHERE property_definition_keyname = 'event-time';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time1, s_e.time1, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time1 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time2, s_e.time2, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time2 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time3, s_e.time3, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time3 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time4, s_e.time4, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time4 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time5, s_e.time5, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time5 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time6, s_e.time6, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time6 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time7, s_e.time7, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time7 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time8, s_e.time8, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time8 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time9, s_e.time9, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time9 != '0000-00-00 00:00:00';
INSERT INTO `property` (`property_definition_keyname`, `entity_id`, `language`, `value_datetime`, `value_display`, `created`, `created_by`)
SELECT 'event-time', (SELECT id FROM entity WHERE old_id = concat('event-',s_e.id)) entity_id
      , NULL, s_e.time0, s_e.time0, now(), 'import'
 FROM saal_events s_e
 HAVING entity_id IS NOT NULL AND s_e.time0 != '0000-00-00 00:00:00';


    INSERT IGNORE INTO relationship (entity_id, related_entity_id, `relationship_definition_keyname`)
    SELECT e.id AS entity_id, (SELECT id FROM entity WHERE old_id = 'mihkel') AS related_entity_id, 'owner' AS `relationship_definition_id`
    FROM entity e
    WHERE id NOT IN
    (SELECT e.id
    FROM entity e
    LEFT JOIN relationship r ON r.entity_id = e.id
    WHERE  r.relationship_definition_keyname = 'owner'
    AND  r.related_entity_id IN (SELECT id FROM entity WHERE old_id = 'mihkel')
    );

    INSERT IGNORE INTO relationship (entity_id, related_entity_id, `relationship_definition_keyname`)
    SELECT e.id AS entity_id, (SELECT id FROM entity WHERE old_id = 'argo') AS related_entity_id, 'owner' AS `relationship_definition_id`
    FROM entity e
    WHERE id NOT IN
    (SELECT e.id
    FROM entity e
    LEFT JOIN relationship r ON r.entity_id = e.id
    WHERE  r.relationship_definition_keyname = 'owner'
    AND  r.related_entity_id IN (SELECT id FROM entity WHERE old_id = 'argo')
    );
