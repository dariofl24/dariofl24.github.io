require 'rubygems'
require 'active_record'
require 'postgres-copy'

class ExtendedActiveRecord < ActiveRecord::Base
    self.abstract_class = true

    PGRES_COMMAND_OK = 1

    POSTGRES = 'PostgreSQL'
    SQL_LITE = 'SQLite'

    def self.delete_all_and_reset_pk
        delete_all
        reset_pk_sequence
    end

    def self.reset_pk_sequence
        case connection.adapter_name
            when SQL_LITE
                new_max = maximum(primary_key) || 0
                sql = "UPDATE sqlite_sequence SET seq = #{new_max} WHERE name = #{quoted_table_name};"
                connection.execute(sql)
            when POSTGRES
                connection.reset_pk_sequence!(table_name)
            else
                raise "Task not implemented for this DB adapter"
        end
    end

    def self.import_csv(file_path, options = {}, delete = true)
        transaction do
            delete_all_and_reset_pk if delete

            case connection.adapter_name
                when POSTGRES
                    pg_copy_from(file_path, options)
                    validate_remote_operation()
                else
                    raise "Task not implemented for this DB adapter"
            end
        end
    end

    def self.export_csv(file_path)
        case connection.adapter_name
            when POSTGRES
                File.open(file_path, 'w') { |file|
                    pg_copy_to do |line|
                        file.puts line
                    end
                }
            else
                raise "Task not implemented for this DB adapter"
        end
    end

    def self.delete_duplicates(columns)
        case connection.adapter_name
            when POSTGRES
                sql = "DELETE FROM #{quoted_table_name} WHERE id IN " +
                      "  (SELECT id FROM (SELECT id, row_number() over (partition BY \"#{columns.join('","')}\" ORDER BY id) AS rnum " +
                      "   FROM #{quoted_table_name}) t " +
                      "   WHERE t.rnum > 1);"
                connection.execute(sql)
            else
                raise "Task not implemented for this DB adapter"
        end
    end

    def self.validate_remote_operation()
        result = connection.raw_connection.get_result
        unless result.result_status == PGRES_COMMAND_OK
            details = [
                result.error_field(PG::Result::PG_DIAG_SEVERITY),
                result.error_field(PG::Result::PG_DIAG_SQLSTATE),
                result.error_field(PG::Result::PG_DIAG_MESSAGE_PRIMARY),
                result.error_field(PG::Result::PG_DIAG_CONTEXT)
            ]

            raise "#{result.res_status(result.result_status)}. Details: #{details}."
        end
    end

end
