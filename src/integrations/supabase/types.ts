export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      campaign_generator_pages: {
        Row: {
          contact_email: string | null
          created_at: string
          default_campaign_settings: Json | null
          default_theme_color: string | null
          full_url: string | null
          google_maps_url: string | null
          id: string
          restaurant_name: string
          slug: string
          team_access_enabled: boolean | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          default_campaign_settings?: Json | null
          default_theme_color?: string | null
          full_url?: string | null
          google_maps_url?: string | null
          id?: string
          restaurant_name: string
          slug: string
          team_access_enabled?: boolean | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          default_campaign_settings?: Json | null
          default_theme_color?: string | null
          full_url?: string | null
          google_maps_url?: string | null
          id?: string
          restaurant_name?: string
          slug?: string
          team_access_enabled?: boolean | null
        }
        Relationships: []
      }
      demo_pages: {
        Row: {
          contact_email: string | null
          created_at: string
          full_url: string | null
          google_maps_url: string
          id: string
          restaurant_name: string
          server_names: string[] | null
          slug: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          full_url?: string | null
          google_maps_url: string
          id?: string
          restaurant_name: string
          server_names?: string[] | null
          slug: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          full_url?: string | null
          google_maps_url?: string
          id?: string
          restaurant_name?: string
          server_names?: string[] | null
          slug?: string
        }
        Relationships: []
      }
      demo_preferences: {
        Row: {
          booking_url: string | null
          contact_email: string | null
          created_at: string
          facebook_url: string | null
          google_maps_url: string
          id: string
          instagram_url: string | null
          menu_analysis: Json | null
          menu_url: string | null
          phone_number: string | null
          preferred_booking_method: string | null
          restaurant_name: string
          review_reward_amount: number | null
          server_names: string[] | null
          tip_reward_percentage: number | null
          website_description: string | null
          website_gallery: Json | null
          website_hero_image: string | null
          website_menu_sections: Json | null
          website_url: string | null
        }
        Insert: {
          booking_url?: string | null
          contact_email?: string | null
          created_at?: string
          facebook_url?: string | null
          google_maps_url: string
          id?: string
          instagram_url?: string | null
          menu_analysis?: Json | null
          menu_url?: string | null
          phone_number?: string | null
          preferred_booking_method?: string | null
          restaurant_name: string
          review_reward_amount?: number | null
          server_names?: string[] | null
          tip_reward_percentage?: number | null
          website_description?: string | null
          website_gallery?: Json | null
          website_hero_image?: string | null
          website_menu_sections?: Json | null
          website_url?: string | null
        }
        Update: {
          booking_url?: string | null
          contact_email?: string | null
          created_at?: string
          facebook_url?: string | null
          google_maps_url?: string
          id?: string
          instagram_url?: string | null
          menu_analysis?: Json | null
          menu_url?: string | null
          phone_number?: string | null
          preferred_booking_method?: string | null
          restaurant_name?: string
          review_reward_amount?: number | null
          server_names?: string[] | null
          tip_reward_percentage?: number | null
          website_description?: string | null
          website_gallery?: Json | null
          website_hero_image?: string | null
          website_menu_sections?: Json | null
          website_url?: string | null
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          campaign_type: string | null
          created_at: string
          email_copy: string
          id: string
          menu_photo_url: string | null
          offer_id: string | null
          promo_photos: string[] | null
          restaurant_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          target_sentiment: string | null
          unique_code: string
          voucher_sequence_position: number | null
        }
        Insert: {
          campaign_type?: string | null
          created_at?: string
          email_copy: string
          id?: string
          menu_photo_url?: string | null
          offer_id?: string | null
          promo_photos?: string[] | null
          restaurant_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_sentiment?: string | null
          unique_code: string
          voucher_sequence_position?: number | null
        }
        Update: {
          campaign_type?: string | null
          created_at?: string
          email_copy?: string
          id?: string
          menu_photo_url?: string | null
          offer_id?: string | null
          promo_photos?: string[] | null
          restaurant_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          target_sentiment?: string | null
          unique_code?: string
          voucher_sequence_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "restaurant_offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contacts: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          list_id: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          list_id: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          list_id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_contacts_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "email_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      email_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_provider_connections: {
        Row: {
          access_token: string
          created_at: string
          email: string
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          email: string
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          email?: string
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      follow_up_emails: {
        Row: {
          created_at: string
          email_content: string
          email_subject: string
          id: string
          review_id: string | null
          scheduled_for: string
          sent_at: string | null
          status: string | null
          voucher_details: Json | null
        }
        Insert: {
          created_at?: string
          email_content: string
          email_subject: string
          id?: string
          review_id?: string | null
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          voucher_details?: Json | null
        }
        Update: {
          created_at?: string
          email_content?: string
          email_subject?: string
          id?: string
          review_id?: string | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          voucher_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number
          restaurant_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price: number
          restaurant_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      restaurant_menu_versions: {
        Row: {
          analysis: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          menu_url: string
          metadata: Json | null
          restaurant_id: string | null
          sections: Json | null
          version_number: number
        }
        Insert: {
          analysis?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          menu_url: string
          metadata?: Json | null
          restaurant_id?: string | null
          sections?: Json | null
          version_number: number
        }
        Update: {
          analysis?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          menu_url?: string
          metadata?: Json | null
          restaurant_id?: string | null
          sections?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_menu_versions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_offers: {
        Row: {
          created_at: string
          description: string
          discount_value: string
          email_template: string | null
          id: string
          menu_photo_url: string | null
          promo_photos: string[] | null
          restaurant_id: string | null
          status: string | null
          terms_conditions: string | null
          title: string
          valid_days: number | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description: string
          discount_value: string
          email_template?: string | null
          id?: string
          menu_photo_url?: string | null
          promo_photos?: string[] | null
          restaurant_id?: string | null
          status?: string | null
          terms_conditions?: string | null
          title: string
          valid_days?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          discount_value?: string
          email_template?: string | null
          id?: string
          menu_photo_url?: string | null
          promo_photos?: string[] | null
          restaurant_id?: string | null
          status?: string | null
          terms_conditions?: string | null
          title?: string
          valid_days?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_offers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_pages: {
        Row: {
          created_at: string
          custom_css: Json | null
          custom_url: string | null
          description: string | null
          google_maps_embed_url: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          page_title: string
          restaurant_id: string
          theme_color: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_css?: Json | null
          custom_url?: string | null
          description?: string | null
          google_maps_embed_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          page_title: string
          restaurant_id: string
          theme_color?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_css?: Json | null
          custom_url?: string | null
          description?: string | null
          google_maps_embed_url?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          page_title?: string
          restaurant_id?: string
          theme_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_pages_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_websites: {
        Row: {
          contact_info: Json | null
          created_at: string
          gallery: Json | null
          hero_image: string | null
          id: string
          menu_sections: Json | null
          restaurant_name: string
          slug: string
          theme_color: string | null
          website_content: Json
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          menu_sections?: Json | null
          restaurant_name: string
          slug: string
          theme_color?: string | null
          website_content?: Json
        }
        Update: {
          contact_info?: Json | null
          created_at?: string
          gallery?: Json | null
          hero_image?: string | null
          id?: string
          menu_sections?: Json | null
          restaurant_name?: string
          slug?: string
          theme_color?: string | null
          website_content?: Json
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          average_rating: number | null
          contact_email: string | null
          contact_phone: string | null
          cover_photo_url: string | null
          created_at: string
          cuisine_type: string[] | null
          description: string | null
          google_maps_url: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          price_range: string | null
          slug: string
          status: string | null
        }
        Insert: {
          address: string
          average_rating?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cuisine_type?: string[] | null
          description?: string | null
          google_maps_url?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          price_range?: string | null
          slug: string
          status?: string | null
        }
        Update: {
          address?: string
          average_rating?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          cover_photo_url?: string | null
          created_at?: string
          cuisine_type?: string[] | null
          description?: string | null
          google_maps_url?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          price_range?: string | null
          slug?: string
          status?: string | null
        }
        Relationships: []
      }
      review_page_analytics: {
        Row: {
          avg_review_length: number | null
          created_at: string | null
          id: string
          last_viewed_at: string | null
          link_clicks: number | null
          page_views: number | null
          qr_code_scans: number | null
          receipts_uploaded: number | null
          review_page_id: string
          review_submissions: number | null
          reviews_submitted: number | null
          total_refined_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          avg_review_length?: number | null
          created_at?: string | null
          id?: string
          last_viewed_at?: string | null
          link_clicks?: number | null
          page_views?: number | null
          qr_code_scans?: number | null
          receipts_uploaded?: number | null
          review_page_id: string
          review_submissions?: number | null
          reviews_submitted?: number | null
          total_refined_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_review_length?: number | null
          created_at?: string | null
          id?: string
          last_viewed_at?: string | null
          link_clicks?: number | null
          page_views?: number | null
          qr_code_scans?: number | null
          receipts_uploaded?: number | null
          review_page_id?: string
          review_submissions?: number | null
          reviews_submitted?: number | null
          total_refined_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_page_analytics_review_page_id_fkey"
            columns: ["review_page_id"]
            isOneToOne: false
            referencedRelation: "review_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      review_pages: {
        Row: {
          active: boolean | null
          background_image_url: string | null
          created_at: string
          id: string
          logo_url: string | null
          page_title: string
          restaurant_id: string
          thank_you_message: string | null
          theme_color: string | null
          updated_at: string
          welcome_message: string | null
        }
        Insert: {
          active?: boolean | null
          background_image_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          page_title: string
          restaurant_id: string
          thank_you_message?: string | null
          theme_color?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Update: {
          active?: boolean | null
          background_image_url?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          page_title?: string
          restaurant_id?: string
          thank_you_message?: string | null
          theme_color?: string | null
          updated_at?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_pages_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      review_voucher_emails: {
        Row: {
          created_at: string
          email_content: string
          email_subject: string
          id: string
          review_id: string
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          voucher_code: string
        }
        Insert: {
          created_at?: string
          email_content: string
          email_subject: string
          id?: string
          review_id: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          voucher_code: string
        }
        Update: {
          created_at?: string
          email_content?: string
          email_subject?: string
          id?: string
          review_id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_voucher_emails_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_voucher_suggestions: {
        Row: {
          created_at: string
          id: string
          review_id: string
          status: string | null
          suggested_vouchers: Json
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          status?: string | null
          suggested_vouchers?: Json
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          status?: string | null
          suggested_vouchers?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_review"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_voucher_suggestions_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_name: string
          created_at: string
          id: string
          initial_thoughts_completed_at: string | null
          photo_url: string | null
          receipt_data: Json | null
          receipt_uploaded_at: string | null
          refined_review: string | null
          review_copied_at: string | null
          review_enhanced_at: string | null
          review_page_id: string | null
          review_text: string
          server_name: string | null
          status: string | null
          steps_metadata: Json | null
          unique_code: string
        }
        Insert: {
          business_name: string
          created_at?: string
          id?: string
          initial_thoughts_completed_at?: string | null
          photo_url?: string | null
          receipt_data?: Json | null
          receipt_uploaded_at?: string | null
          refined_review?: string | null
          review_copied_at?: string | null
          review_enhanced_at?: string | null
          review_page_id?: string | null
          review_text: string
          server_name?: string | null
          status?: string | null
          steps_metadata?: Json | null
          unique_code: string
        }
        Update: {
          business_name?: string
          created_at?: string
          id?: string
          initial_thoughts_completed_at?: string | null
          photo_url?: string | null
          receipt_data?: Json | null
          receipt_uploaded_at?: string | null
          refined_review?: string | null
          review_copied_at?: string | null
          review_enhanced_at?: string | null
          review_page_id?: string | null
          review_text?: string
          server_name?: string | null
          status?: string | null
          steps_metadata?: Json | null
          unique_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_review_page_id_fkey"
            columns: ["review_page_id"]
            isOneToOne: false
            referencedRelation: "review_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_plans: {
        Row: {
          coach_personality: Json | null
          content: string
          created_at: string
          id: string
          service: string
          status: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          coach_personality?: Json | null
          content: string
          created_at?: string
          id?: string
          service: string
          status?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          coach_personality?: Json | null
          content?: string
          created_at?: string
          id?: string
          service?: string
          status?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          id: string
          name: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          value?: string
        }
        Relationships: []
      }
      tip_vouchers: {
        Row: {
          created_at: string
          customer_email: string
          expires_at: string
          id: string
          server_name: string
          status: string
          tip_amount: number
          used_at: string | null
          voucher_amount: number
          voucher_code: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          expires_at: string
          id?: string
          server_name: string
          status?: string
          tip_amount: number
          used_at?: string | null
          voucher_amount: number
          voucher_code: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          expires_at?: string
          id?: string
          server_name?: string
          status?: string
          tip_amount?: number
          used_at?: string | null
          voucher_amount?: number
          voucher_code?: string
        }
        Relationships: []
      }
      voucher_sequences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          restaurant_id: string | null
          schedule_config: Json | null
          sequence_order: number[] | null
          status: string | null
          target_sentiment: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          restaurant_id?: string | null
          schedule_config?: Json | null
          sequence_order?: number[] | null
          status?: string | null
          target_sentiment: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          restaurant_id?: string | null
          schedule_config?: Json | null
          sequence_order?: number[] | null
          status?: string | null
          target_sentiment?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_sequences_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_unique_url: {
        Args: {
          title: string
        }
        Returns: string
      }
      get_or_create_restaurant_email_list: {
        Args: {
          restaurant_name: string
        }
        Returns: string
      }
    }
    Enums: {
      audit_status: "pending" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      review_metadata: {
        initial_review: string | null
        refined_review: string | null
        receipt_analysis: Json | null
        server_name: string | null
        reward_code: string | null
        google_maps_url: string | null
        restaurant_name: string | null
        submission_date: string | null
      }
      tip_metadata: {
        tip_amount: number | null
        server_name: string | null
        tip_date: string | null
        voucher_code: string | null
        voucher_status: string | null
        voucher_used_at: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
